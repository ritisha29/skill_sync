# SkillSync – Smart Task & Learning Progress Tracker

SkillSync is an AI-powered, full-stack learning and task management platform designed to help learners organize tasks, track progress, collaborate in real time, and receive personalized study recommendations.

The project was developed during my internship at **Edubot Software and Services** to address common challenges in learning productivity, including generic study guidance, outdated dashboards, and limited real-time collaboration.

## Key Features

- **Secure Authentication:** JWT-based authentication and role-based access for users and administrators.
- **Task Management:** Create, update, and manage tasks with deadlines and tags.
- **Progress Tracking:** Monitor learning activities, task completion, and progress through an interactive dashboard.
- **Real-Time Synchronization:** Instantly synchronize task updates across connected sessions using WebSockets and Socket.IO.
- **AI-Powered Study Tips:** Generate personalized weekly learning recommendations using the Gemini API and user activity data.
- **Audio Reflection Logging:** Record and review audio notes to support learning reflection.
- **Analytics Dashboard:** Visualize learning progress using charts and summary statistics.
- **Admin Panel:** Provide administrative interfaces for monitoring activity and managing content.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, ShadCN UI |
| Backend | Flask (Python), Express.js |
| Database | PostgreSQL, Neon DB |
| Authentication | JSON Web Tokens (JWT), role-based access |
| Real-Time Communication | WebSockets, Flask-SocketIO |
| AI Integration | Google Gemini API |
| Development Tools | Git, GitHub, REST APIs |

## System Architecture

SkillSync follows a full-stack architecture that connects the user interface, backend services, database, real-time communication layer, and AI integration.

1. **Presentation Layer:** React and TypeScript provide the interactive dashboard, task management interface, and progress visualizations.
2. **Backend Layer:** Flask and Express.js support application logic and API-based communication.
3. **Data Layer:** PostgreSQL stores application data, including tasks and progress-related information.
4. **Real-Time Layer:** WebSocket-based communication enables task updates to be synchronized across connected sessions.
5. **AI Layer:** The Gemini API generates study tips based on relevant user activity and learning progress.

## Software Engineering Highlights

- Developed a component-based frontend for maintainable UI development.
- Integrated frontend and backend functionality through API-based communication.
- Implemented authentication and role-based access control.
- Designed task-management workflows supporting create, read, update, and delete operations.
- Integrated real-time event handling to reduce reliance on manual dashboard refreshes.
- Connected an external generative AI API to deliver contextual learning recommendations.

## Getting Started

### Prerequisites

Install the following tools before running the application:

- Node.js and npm
- Python 3
- PostgreSQL or a compatible PostgreSQL database service
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ritisha29/skill_sync.git
cd skill_sync
```

Install the Node.js dependencies:

```bash
npm install
```

Configure the environment variables required by the application. Refer to the project's configuration files and backend implementation to identify the exact variable names.

Create a local `.env` file for your credentials and configuration. **Never commit this file or expose API keys, database passwords, or JWT secrets.**

### Running the Application

Use the scripts defined in `package.json` to start the application. For example, if the project defines a development script:

```bash
npm run dev
```

The exact startup procedure may depend on the configured frontend and backend scripts. Check `package.json` and the server configuration before running the application.

## Project Objectives

- Improve task organization and learning productivity.
- Provide a centralized interface for task and progress management.
- Enable real-time synchronization across connected user sessions.
- Deliver personalized AI-generated study recommendations.
- Integrate frontend, backend, database, and AI services into one application.

## Future Enhancements

- Develop a mobile application using React Native.
- Integrate calendar and scheduling services.
- Introduce gamification features such as badges and leaderboards.
- Add advanced NLP and sentiment-analysis capabilities.
- Support Google and GitHub OAuth authentication.

## Learning Outcomes

This project provided hands-on experience in full-stack application development, API integration, authentication, database connectivity, real-time communication, and generative AI integration. It also strengthened my understanding of modular design, system integration, and user-focused software engineering.

## Author

**Sai Ritisha Burugupalli**

B.Tech – Computer Science and Engineering (AI & ML)  
SRM University, AP

- GitHub: [ritisha29](https://github.com/ritisha29)

---

*Built as part of a summer internship project at Edubot Software and Services.*
