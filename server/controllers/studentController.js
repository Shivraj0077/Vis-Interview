const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Document = require('../models/Document');
const Interview = require('../models/Interview');
const BackgroundCheck = require('../models/BackgroundCheck');
const { extractTextFromImage, parseDocumentData } = require('../services/ocrService');
const { analyzeTranscript, analyzeSingleAnswer, transcribeAudio } = require('../services/geminiService');
const { calculateFinalScore, determineRiskLevel } = require('../services/scoringService');
const { performBackgroundCheck } = require('../services/backgroundService');

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
        // Create student record if not exists (usually should exist)
        student = await Student.create({ user: req.user._id, passportNumber: 'PENDING', dob: new Date() });
    }

    let extractedData = {};
    if (file.mimetype.startsWith('image/')) {
        const text = await extractTextFromImage(file.path);
        extractedData = parseDocumentData(text, type);
    }

    // Update passport number if passport uploaded
    if (type === 'Passport' && extractedData.name) {
        // Simple check if name matches user name? optional
    }

    const document = await Document.create({
        student: student._id,
        type,
        filePath: file.path,
        extractedData,
        isValid: true // Assume valid for now or add validation logic
    });

    res.status(201).json(document);
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
        finalAnswerText = await transcribeAudio(file.path);
    }

    if (!finalAnswerText) {
        res.status(400);
        throw new Error('No answer provided (text or audio)');
    }

    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
        student = await Student.create({ user: req.user._id, passportNumber: 'PENDING', dob: new Date() });
    }

    // Analyze this specific answer for immediate feedback
    const singleAnalysis = await analyzeSingleAnswer(questionText, finalAnswerText);

    let interview = await Interview.findOne({ student: student._id });
    if (!interview) {
        interview = await Interview.create({
            student: student._id,
            questions: [],
            status: 'Pending'
        });
    }

    // Update or add the answer at the specific index
    const questionObj = {
        question: questionText,
        answerAudioPath: file ? file.path : null, // Optional in free stack
        answerText: finalAnswerText,
        score: singleAnalysis.score,
        feedback: singleAnalysis.feedback
    };

    if (interview.questions[questionIndex]) {
        interview.questions[questionIndex] = questionObj;
    } else {
        interview.questions.push(questionObj);
    }

    // If all (e.g., 4) questions are answered, trigger final report
    if (interview.questions.length >= 4) {
        const fullTranscript = interview.questions.map(q => `Q: ${q.question}\nA: ${q.answerText}`).join('\n\n');
        interview.transcript = fullTranscript;

        const analysis = await analyzeTranscript(fullTranscript);
        interview.geminiAnalysis = analysis;
        interview.status = 'Completed';

        // Update Student Score based on 30/40/30 weights
        let background = await BackgroundCheck.findOne({ student: student._id });
        if (!background) {
            const checkResult = await performBackgroundCheck(req.user.name);
            background = await BackgroundCheck.create({ student: student._id, ...checkResult });
        }

        const docApproveCount = await Document.countDocuments({ student: student._id, isValid: true });
        const docScore = Math.min(docApproveCount * 15, 100);
        const interviewScore = analysis.overallCredibilityScore || 50;
        const backgroundScore = background.riskScore || 50;

        const finalScore = calculateFinalScore(docScore, interviewScore, backgroundScore);
        student.finalScore = finalScore;
        student.riskLevel = determineRiskLevel(finalScore);
        await student.save();
    }

    await interview.save();
    res.json({
        message: 'Answer processed successfully',
        questionIndex,
        answerText: finalAnswerText,
        singleAnalysis,
        isCompleted: interview.status === 'Completed'
    });
});

module.exports = { getStudentProfile, uploadDocument, submitAnswer };
