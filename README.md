Event Lead Manager

Event Lead Manager is a small full-stack application made to help manage people you meet at business events.

When meeting multiple people at an event, it can be difficult to remember who you spoke to, what you discussed, and who needs to be contacted later. This application keeps all of that information in one place and also uses AI to generate a personalized follow-up message.

Features

* Add new event leads
* Edit existing leads
* Delete leads
* Search leads by name, company, or event
* Filter leads by follow-up status
* View all leads
* Store lead information in PostgreSQL
* Generate AI-powered follow-up messages
* Responsive interface for desktop and mobile

Each lead contains:

* Name
* Company
* Email
* Event
* Notes
* Follow-up status

Tech Stack

Frontend

* Next.js
* React
* Tailwind CSS

Backend

* Python
* FastAPI
* SQLAlchemy

Database

* PostgreSQL

AI

* Google Gemini API

How It Works

The application is divided into a frontend and a backend.

The Next.js frontend provides the user interface. When a user adds, edits, searches, or deletes a lead, the frontend sends a request to the FastAPI backend.

The FastAPI backend handles the API requests and communicates with PostgreSQL using SQLAlchemy.

For AI follow-ups, the backend sends the lead information and notes to the Gemini API. The generated follow-up message is then returned to the frontend and displayed to the user.

The basic flow is:


Next.js Frontend
       ↓
FastAPI Backend
       ↓
PostgreSQL Database

FastAPI Backend
       ↓
Google Gemini API
       ↓
AI Follow-Up Message

Project Structure

event-lead-manager/
│
├── backend/
│   ├── ai_service.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── .gitignore
└── package.json


Running the Project Locally

1. Clone the repository

```bash
git clone <your-github-repository-url>
cd event-lead-manager
```

2. Backend Setup

Go into the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv google-genai
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Then start the backend:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is also available at:

```text
http://127.0.0.1:8000/docs
```

3. Frontend Setup

Open another terminal and go to the frontend:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:3000
```

API Endpoints

| Method | Endpoint        | Purpose                  |
| ------ | --------------- | ------------------------ |
| GET    | `/leads`        | Get all leads            |
| POST   | `/leads`        | Create a new lead        |
| GET    | `/leads/{id}`   | Get one lead             |
| PUT    | `/leads/{id}`   | Update a lead            |
| DELETE | `/leads/{id}`   | Delete a lead            |
| GET    | `/leads/search` | Search and filter leads  |
| POST   | `/ai/followup`  | Generate an AI follow-up |

AI Follow-Up

The AI feature uses Google Gemini to create a short and professional follow-up message based on the lead's:

* Name
* Company
* Event
* Notes

The prompt also tells the AI not to invent information that is not provided by the user.

Environment Variables

The project uses environment variables for sensitive information such as the PostgreSQL connection string and Gemini API key.

The `.env` file is intentionally excluded from Git using `.gitignore`.


About the Project

This project was built as a full-stack development assignment to practice working with a frontend, REST APIs, databases, and AI integration together in one application.
