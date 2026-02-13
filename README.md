# AI-Driven Interview and Background Verification System

A college final-year project for verifying international student visa applications using AI.

## Features

- **Role-Based Access**: Student and Admin (Verifier) portals.
- **Document Verification**: OCR extraction (Passport, Transcript, etc.) and validation.
- **Voice Interview**: Audio recording and AI-based transcript analysis.
- **AI Scoring Engine**: Calculates risk based on Documents (30%), Interview (40%), and Background (30%).
- **Mock Background Check**: Simulates global security checks.
- **Admin Dashboard**: Review applications and make final decisions.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB
- **AI Services**: Google Gemini API (NLP & Analysis), Tesseract.js (OCR)

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or Atlas URI)
- Google Cloud API Key (for Gemini)

## Setup Instructions

### 1. Database Setup
Ensure MongoDB is running locally on port 27017, or update `server/.env` with your URI.

### 2. Backend Setup

```bash
cd server
npm install
# Create a .env file based on the example provided
# cp .env.example .env
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Configuration (.env)

**Server (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/visa-app
JWT_SECRET=secret
GEMINI_API_KEY=your_google_api_key
```

## Usage Flow

1. **Sign Up**: Register as a Student.
2. **Dashboard**: View your application checklist.
3. **Upload**: Upload required documents (Passport, Transcript).
4. **Interview**: Record your voice answers to the 4 questions.
5. **Wait**: The system calculates scores and risk levels.
6. **Admin**: Log in as Admin (create manually or sign up with 'admin' role if enabled) to review and approve.

## Project Structure

- `server/models`: Database schemas.
- `server/services`: AI and logic (OCR, Gemini, Scoring).
- `client/app`: Next.js pages and components.

## Disclaimer
This is an educational project and uses mock data for background checks.
# Visa-app-final
