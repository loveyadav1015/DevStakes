# Aegis: Kinetic Archive

## Team Name
WYM

## Team Members
- Love Yadav (GitHub: @loveyadav1015)
- Ayush Kumar (GitHub: @GOLDEN-DEVIL)
- Piyansh Shukla (GitHub: @P1yansh)
- Rajmohan Verma (GitHub: @rajv20)

## Idea Chosen
Smart Exam Preparation Planner with an interactive node-based learning roadmap.

## Problem Statement
Students often struggle with overloaded syllabi, missed study sessions, and last-minute cramming. Fixed timetables do not adapt well when a day is missed, which can quickly create stress, poor prioritization, and burnout. Aegis addresses this by organizing study work into a flexible, priority-based system that helps students stay on track even when plans change.

## Tech Stack
**Frontend**
- React 19 & Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Zustand (State Management)
- Lucide React

**Backend & Database**
- Python 3
- FastAPI & Uvicorn (Web Framework & Server)
- MongoDB & Motor (Asynchronous NoSQL Database)
- Pydantic (Data Validation)

**AI & Integrations**
- Groq API (`llama-3.1-8b-instant`)

## Implementation Details

Aegis is built as a full-stack application featuring a React-based frontend dashboard and a robust FastAPI backend. 

**Frontend Architecture:**
The UI is a multi-page dashboard with a shared layout shell, featuring views for the main dashboard, adaptive calendar, interactive syllabus map, and creation flows. State management is handled with Zustand, which connects to the backend API (`/api/*`) for data persistence. The UI focuses on visual planning—highlighting core metrics like burnout risk, efficiency, and daily focus.

**Backend & System Architecture:**
The backend uses a Modular Router & Service pattern served by FastAPI. It connects to a MongoDB database via the Motor async driver, automatically seeding collections (`sessions`, `nodes`, `connections`) on startup if empty. Request and response payloads are strictly validated using Pydantic models.

Key backend services driving the app's logic include:
- **Self-Healing Scheduler (`services/scheduler.py`):** Automatically recalculates the study schedule when a user misses a session. It finds open slots between 08:00–21:00 and reschedules missed tasks based on priority (high → medium → low).
- **Burnout & Metrics Engine (`services/burnout.py`):** Computes real-time metrics for the dashboard. Burnout risk (0-100) is calculated dynamically based on missed ratios, schedule density, late penalties, and consecutive misses. It also calculates overall efficiency and peak output hours.
- **Node Map Graph Management (`routers/nodes.py`):** Manages the syllabus nodes and connections. Creating nodes with a `parentId` automatically generates edge relationships, simulating a directed graph for prerequisites.
- **AI Integration (`services/ai_generator.py`):** Utilizes the Groq API to generate mission briefs and task descriptions based on study topics and priorities (with built-in fallback templates if API keys are missing).

## How to Run Locally
1. Open the project folder:
   ```bash
   cd DevStakes/teams/WYM
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

### Prerequisites
- Node.js installed
- Python 3.9+ installed
- MongoDB running locally (or a MongoDB Atlas connection string)
- Groq API Key (Optional, for AI features)

## Live Demo
Add your deployed app link here.

## Screenshots / Demo
[Add screenshots or a demo video link here.](https://drive.google.com/file/d/1T2iowKmj4HrRalTDpcN7jDS4QC6DK5nu/view?usp=sharing)