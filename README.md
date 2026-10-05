# 🎯 PrepMate - AI Interview Mocker

PrepMate is an AI-powered mock interview platform designed to help job seekers practice their interviewing skills and get hired faster. By leveraging state-of-the-art LLMs, PrepMate generates realistic, role-specific interview questions and provides instant, actionable feedback based on your actual voice responses.

## ✨ Features

- **Tailored Mock Interviews:** Enter your target job role, tech stack, and experience level, and PrepMate will dynamically generate a custom 5-question interview.
- **Real-Time Voice Analysis:** Uses speech-to-text to capture your answers naturally, just like a real interview.
- **AI-Powered Feedback:** Evaluates your answers against the ideal response, providing a score out of 10 and concrete suggestions for improvement.
- **Beautiful & Responsive UI:** Built with Next.js, Tailwind CSS, and Shadcn UI for a seamless, modern experience.
- **Secure Authentication:** Integrated with Clerk for secure, production-ready user management.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Authentication:** Clerk
- **Database:** Neon (Serverless Postgres) + Drizzle ORM
- **AI Model:** Google Gemini (gemma-4)
- **Audio Processing:** react-speech-recognition

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env.local` file and add your credentials.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

PrepMate is optimized for deployment on Vercel. Connect your GitHub repository to Vercel and ensure your environment variables are set in the Vercel dashboard.

---
*Built to help you ace your next interview.*
