# EduVision - AI-Powered Visual Learning Platform



Transform complex concepts into engaging visual learning experiences with AI-powered animations and interactive quizzes.

## 🚀 Overview

EduVision is an innovative educational platform that leverages artificial intelligence to convert natural language descriptions into animated educational videos. It combines the power of large language models (LLMs) with advanced animation technologies like Manim and VPython to create immersive learning experiences.

## 🏗️ System Architecture

<div align="center">
  <img src="./attached_assets/system diagram.png" alt="EduVision System Architecture" width="800"/>
  <p><em>Figure 1: High-level system architecture of EduVision platform</em></p>
</div>

### Key Components

1. **Frontend Layer**
   - Modern, responsive UI built with React and TypeScript
   - Interactive video player and quiz interfaces
   - Real-time progress tracking and feedback

2. **Backend Services**
   - RESTful API built with Node.js and Express
   -LLM data parsing
   - Request routing and processing

3. **AI Processing**
   - Text analysis and understanding using Gemini
   - Content generation and structuring
   - Animation script generation

4. **Video Generation**
   - Manim for mathematical animations
   - VPython for 3D visualizations
   - Video optimization and processing

5. **Data Storage**
   - PostgreSQL for structured data
   - File system for media storage
   - Caching layer for improved performance

### Key Components

1. **Frontend (React + TypeScript)**
   - Modern, responsive UI built with React and TypeScript
   - State management with React Context
   - Interactive quiz and video player components

2. **Backend (Node.js + Express)**
   - RESTful API endpoints
   - Integration with Gemini AI for content generation
   - Database operations and session management

3. **AI & Animation Engine**
   - LLM-powered content generation
   - Manim for mathematical animations
   - VPython for 3D visualizations
   - Video optimization pipeline

4. **Database (PostgreSQL)**
   - User data and preferences
   - Video and quiz history
   - Performance analytics

## 🛠️ Installation

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- PostgreSQL
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/PreethamMR22/testing.git
   cd testing
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory with the following content:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://neondb_owner:npg_iLGPf7KaC4mT@ep-red-bread-ahvklmt7-pooler.c-3.us-east-1.aws.neondb/neondb?sslmode=require&channel_binding=require

   # Session Configuration
   SESSION_SECRET=your-secret-key-here-change-this-in-production

   # Node Environment
   NODE_ENV=development

   # Server Port
   PORT=8000

   # API Keys
   GEMINI_API_KEY=your-gemini-api-key
   REACT_APP_YOUTUBE_API_KEY=your-youtube-api-key
   ```

3. **Set up frontend environment**
   ```bash
   cd client
   echo "VITE_YOUTUBE_API_KEY=your-youtube-api-key" > .env
   cd ..
   ```

4. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..

   # Install Python dependencies
   cd hack27
   python -m pip install -r requirements.txt
   ```

5. **Set up UV Package Manager and Virtual Environment**
   ```bash
   # Install UV package manager
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # Sync dependencies and create virtual environment
   uv sync
   
   # Activate the virtual environment
   source .venv/bin/activate  # On Unix/Linux/MacOS
   # OR
   .venv\Scripts\activate    # On Windows
   
   # Run the application
   uv run main.py
   ```

## 🚀 Running the Application

1. **Start the AI and animation service**
   ```bash
   cd hack27
   python3 main.py
   ```

2. **In a new terminal, start the main application**
   ```bash
   # From the root directory
   npm run dev
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## 🎯 Features

- **AI-Powered Video Generation**
  - Convert text descriptions to educational animations
  - Support for complex mathematical and scientific concepts
  - Customizable animation parameters

- **Interactive Learning**
  - AI-generated quizzes based on video content
  - Real-time feedback and explanations
  - Progress tracking and performance analytics

- **Content Discovery**
  - Browse and search educational videos
  - Personalized recommendations
  - YouTube integration for additional resources

- **User Profile**
  - Track learning progress
  - View history and achievements
  - Manage saved content

## 📚 Tech Stack

- **Frontend**
  - React.js
  - TypeScript
  - Tailwind CSS
  - Vite

- **Backend**
  - Node.js
  - Express.js
  - PostgreSQL
  - Prisma ORM

- **AI & Animation**
  - Google Gemini
  - Manim
  - VPython
  - UV package manager


## 🙏 Acknowledgments

We are deeply grateful to the following organizations and communities for their invaluable support:

- **Scaler School of Technology** for their exceptional mentorship and guidance throughout the development of this project
- **DevForge Team** for their continuous support, technical expertise, and encouragement
- The **Manim community** for their incredible animation engine that powers our visualizations
- **Google** for the Gemini AI models that enable our intelligent content generation


---

<div align="center">
  Made with ❤️ by the Code Warriors Team
</div>
