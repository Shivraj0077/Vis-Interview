const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Document = require('../models/Document');
const Interview = require('../models/Interview');
const BackgroundCheck = require('../models/BackgroundCheck');
const { extractTextFromImage, validateDocumentLogic } = require('../services/ocrService');
const { analyzeTranscript, analyzeSingleAnswer, transcribeAudio, parseDocument, generateFinalRecommendations } = require('../services/geminiService');
const { calculateFinalScore, determineRiskLevel } = require('../services/scoringService');
const { performFullBackgroundCheck } = require('../services/backgroundService');
const { generateNextQuestion } = require('../services/interviewService');
const { analyzeHolistically } = require('../services/geminiService');

/**
 * Cross-document consistency checks logic
 */
const runCrossDocChecks = (docs) => {
    const flags = [];
    const docMap = {};
    docs.forEach(d => docMap[d.type] = d.extractedData);

    const passport = docMap['Passport'];
    const i20 = docMap['Form I-20'];
    const offerLetter = docMap['Offer Letter'];
    const bank = docMap['Bank Statement'];
    const sop = docMap['Statement of Purpose'];

    // 1. Identity Consistency
    if (passport && i20 && passport.fullName !== i20.studentName) {
        flags.push("Identity Mismatch: Passport name doesn't match I-20 student name.");
    }
    if (passport && offerLetter && passport.fullName !== offerLetter.studentName) {
        flags.push("Identity Mismatch: Passport name doesn't match Offer Letter student name.");
    }

    // 2. Academic Alignment
    if (i20 && offerLetter) {
        if (i20.schoolName !== offerLetter.universityName) {
            flags.push("Institution Mismatch: I-20 school differs from Offer Letter university.");
        }
        if (i20.programName !== offerLetter.programName) {
            flags.push("Program Mismatch: I-20 program differs from Offer Letter program.");
        }
    }

    // 3. Financial Sufficiency
    if (bank && i20 && bank.currentBalance < i20.estimatedCost) {
        flags.push(`Insufficient Funds: Bank balance ($${bank.currentBalance}) is less than first-year cost ($${i20.estimatedCost}).`);
    }

    // 4. Intent Mismatch
    if (sop && offerLetter && sop.programMentioned !== offerLetter.programName) {
        flags.push("Intent Flag: SOP mentions a different program than the Offer Letter.");
    }

    return flags;
};

// @desc    Get Student Profile
// @route   GET /api/student/profile
// @access  Private
const getStudentProfile = asyncHandler(async (req, res) => {
    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
        student = await Student.create({
            user: req.user._id,
            passportNumber: 'PENDING',
            dob: new Date(),
        });
    }

    const documents = await Document.find({ student: student._id });
    const interview = await Interview.findOne({ student: student._id });
    const background = await BackgroundCheck.findOne({ student: student._id });
    res.json({ student, documents, interview, background });
});

// @desc    Upload Document
// @route   POST /api/student/upload
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    const { type } = req.body;
    const file = req.file;

    if (!file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
        student = await Student.create({ user: req.user._id, passportNumber: 'PENDING', dob: new Date() });
    }

    let extractedData = {};
    let validationFlags = [];
    let ocrConfidence = 100;

    if (file.mimetype.startsWith('image/')) {
        const { text, confidence } = await extractTextFromImage(file.location);
        ocrConfidence = confidence;
        extractedData = await parseDocument(text, type);
        validationFlags = await validateDocumentLogic(extractedData, type);
        
        if (confidence < 60) {
            validationFlags.push("Low OCR Confidence: Possible document tampering or poor scan quality.");
        }

        // Update Student Profile from extracted data
        if (type === 'Passport' && extractedData.fullName) {
            student.fullName = extractedData.fullName;
            student.passportNumber = extractedData.passportNumber || student.passportNumber;
            if (extractedData.dob) student.dob = new Date(extractedData.dob);
            if (extractedData.nationality) student.nationality = extractedData.nationality;
        } else if (type === 'Form I-20' && extractedData.studentName && !student.fullName) {
            student.fullName = extractedData.studentName;
        }
    }

    const document = await Document.create({
        student: student._id,
        type,
        filePath: file.location,
        extractedData,
        ocrConfidence,
        validationFlags,
        isValid: validationFlags.length === 0
    });

    // If Passport is uploaded, trigger background check
    let backgroundHits = [];
    if (type === 'Passport' && student.fullName) {
        const check = await performFullBackgroundCheck(student);
        student.backgroundHits = check.hits;
        student.backgroundScore = check.score;
        backgroundHits = check.hits;
    }

    const allDocs = await Document.find({ student: student._id });
    student.documentsUploaded = allDocs.length;
    
    const crossFlags = runCrossDocChecks(allDocs);
    
    // Auto-save recommendations based on findings
    const recommendations = [...crossFlags];
    if (validationFlags.length > 0) recommendations.push(...validationFlags);
    student.recommendations = [...new Set([...student.recommendations, ...recommendations])];

    await student.save();
    
    res.status(201).json({ document, crossFlags, backgroundHits });
});

// @desc    Submit Individual Interview Answer
// @route   POST /api/student/answer
// @access  Private
const submitAnswer = asyncHandler(async (req, res) => {
    const { questionIndex, questionText, answerText } = req.body;
    const file = req.file;

    let finalAnswerText = answerText;

    // If answerText is not provided but audio is, transcribe it (fallback)
    if (!finalAnswerText && file) {
        finalAnswerText = await transcribeAudio(file.location);
    }
    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
        student = await Student.create({ user: req.user._id, passportNumber: 'PENDING', dob: new Date() });
    }

    // Analyze this specific answer for immediate feedback
    const interview = await Interview.findOne({ student: student._id });
    if (!interview) {
        res.status(404);
        throw new Error('Interview not started');
    }

    const docs = await Document.find({ student: student._id });
    const analysisResult = await generateNextQuestion(student, interview, docs);

    // Update or add the answer
    const questionObj = {
        question: questionText,
        answerAudioPath: file ? file.location : null,
        answerText: finalAnswerText,
        evaluation: analysisResult.evaluation
    };

    if (interview.questions[questionIndex]) {
        interview.questions[questionIndex] = questionObj;
    } else {
        interview.questions.push(questionObj);
    }

    // Advance phase if AI suggests
    if (analysisResult.advancePhase && interview.currentPhase < 5) {
        interview.currentPhase += 1;
    }

    // If Phase 5 and answered, complete
    if (interview.currentPhase === 5 && interview.questions.length >= 6) {
        interview.status = 'Completed';
        const fullTranscript = interview.questions.map(q => `Q: ${q.question}\nA: ${q.answerText}`).join('\n\n');
        interview.transcript = fullTranscript;
        
        // Final score calculation
        const docApproveCount = await Document.countDocuments({ student: student._id, isValid: true });
        const docScore = (docApproveCount / 6) * 30; // Max 30
        const backgroundScore = student.backgroundScore; // Max 25 (0 to 25)
        
        // Average interview scores
        const avgSpec = interview.questions.reduce((acc, q) => acc + (q.evaluation?.specificity || 5), 0) / interview.questions.length;
        const avgCons = interview.questions.reduce((acc, q) => acc + (q.evaluation?.consistency || 5), 0) / interview.questions.length;
        
        const interviewScoreTotal = (avgSpec * 2) + (avgCons * 2) + 5; // Simplified map to 45 points range
        
        student.finalScore = docScore + backgroundScore + interviewScoreTotal;
        student.riskLevel = determineRiskLevel(student.finalScore);
        
        // Final AI recommendations
        student.recommendations = await generateFinalRecommendations(student, docs);
        
        await student.save();
    }

    await interview.save();
    res.json({
        message: 'Answer processed successfully',
        nextQuestion: interview.status !== 'Completed' ? await generateNextQuestion(student, interview, docs) : null,
        isCompleted: interview.status === 'Completed'
    });
});

// @desc    Get Next Interview Question
// @route   GET /api/student/interview/next
// @access  Private
const getNextInterviewQuestion = asyncHandler(async (req, res) => {
    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    let interview = await Interview.findOne({ student: student._id });
    if (!interview) {
        interview = await Interview.create({ student: student._id, questions: [], currentPhase: 1 });
    }

    const docs = await Document.find({ student: student._id });
    const nextQ = await generateNextQuestion(student, interview, docs);
    
    res.json(nextQ);
});

// @desc    Run Holistic Document Analysis
// @route   POST /api/student/analyze-all
// @access  Private
const runHolisticAnalysis = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    const docs = await Document.find({ student: student._id });
    if (docs.length === 0) {
        res.status(400);
        throw new Error('No documents uploaded yet');
    }

    const result = await analyzeHolistically(student, docs);
    if (!result) {
        res.status(500);
        throw new Error('Holistic analysis failed');
    }

    // Update student with insights
    student.recommendations = [...new Set([...student.recommendations, ...result.deepInsights, ...result.criticalContradictions])];
    
    // Adjust score based on holistic result (optional logic)
    const currentScore = student.finalScore || 50;
    student.finalScore = Math.round((currentScore + result.holisticScore) / 2);
    student.riskLevel = determineRiskLevel(student.finalScore);

    await student.save();

    res.json(result);
});

module.exports = { getStudentProfile, uploadDocument, submitAnswer, getNextInterviewQuestion, runHolisticAnalysis };
