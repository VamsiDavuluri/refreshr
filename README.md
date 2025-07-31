#  Refreshr - Full-Stack Quiz & Study Platform

Welcome to Refreshr, a modern full-stack application built with React and Node.js. This project provides a robust platform for users to test their knowledge across multiple technical subjects, review their performance, and track their progress over time.

## ✨ Features

#### ✅ User & Authentication
- **Secure Sign-Up & Login:** JWT-based authentication flow with `bcrypt` for robust password hashing.
- **Protected Routes:** Frontend pages and backend API endpoints are protected, ensuring only authenticated users can access core features.
- **Session Management:** Intelligently handles token expiration with automatic redirection to the login page.
- **Profile Dropdown:** Clean user interface for accessing profile-related pages and logging out.

#### 🧠 Quiz & Learning Engine
- **Multiple Subjects:** Core subjects like Data Structures, DBMS, Agile, and more are available with a large bank of challenging questions.
- **Randomized Quizzes:** Each quiz session pulls a random set of 15 questions from a larger pool, ensuring a unique experience every time.
- **Detailed Review:** After each quiz, users can review their answers, see the correct ones, and read detailed explanations to aid learning and retention.
- **Attempt History:** Users can visit the "My Attempts" page to view a complete history of their past quiz scores, allowing them to track their progress.

---

## 📦 Tech Stack

| Area      | Technology / Library                                                        |
| --------- | --------------------------------------------------------------------------- |
| **Frontend**  | React, React Router, Axios, `react-hook-form`, `yup` (for validation), CSS    |
| **Backend**   | Node.js, Express, JWT, Bcrypt, `cors`, `dotenv`                               |
| **Database**  | Simple File-System DB (`database.json`) for rapid prototyping and easy setup. |

---

## 🛠️ Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/VamsiDavuluri/refreshr.git
cd refreshr
```

#### 2. Setup Backend
```bash
cd backend
npm install```
Create a `.env` file in the `backend` directory and add your JWT secret key:
```# backend/.env
JWT_SECRET=your_super_long_and_secret_jwt_key
```
Then, start the backend server:
```bash
npm start
```

#### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Then, start the frontend development server:
```bash
npm start
```
- **Frontend** runs on `http://localhost:3000`
- **Backend** runs on `http://localhost:5000`

---

## 🗂️ Project Modules

| Module            | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| **Auth**          | Login, Register, Logout, and JWT session management via secure routes.     |
| **Quiz Engine**   | Handles quiz logic, dynamic question fetching, and scoring.              |
| **Review System** | Displays a detailed post-quiz review with answers and explanations.      |
| **User Dashboard**| A centralized "My Attempts" page to view a history of all past quiz scores. |

---

## 🔐 Route Protection Summary

| Route           | Access              | Behavior on Failure                               |
| --------------- | ------------------- | ------------------------------------------------- |
| `/login`        | Guests only         | Redirects to `/home` if already logged in.        |
| `/register`     | Guests only         | Redirects to `/home` if already logged in.        |
| `/subjects`     | Authenticated Users | Redirects to `/login` if not authenticated.       |
| `/quiz/:subject`| Authenticated Users | Redirects to `/login` if not authenticated.       |
| `/my-attempts`  | Authenticated Users | Redirects to `/login` if not authenticated.       |

---

