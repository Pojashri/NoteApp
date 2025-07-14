# 📝 NotesApp — Full Stack Notes Manager

This is a **full-stack Notes App** built using React.js for frontend and ASP.NET Core Web API for backend.

> It supports voice-to-text note creation, password-protected notes, and displays notes with metadata such as created/updated date.



## 📁 Project Structure


NotesApp/
├── notes-frontend/    # React.js frontend (Tailwind + Vite)
└── notes-backend/     # ASP.NET Core backend API


## 🔧 How to Run Locally

### ▶️ 1. Clone this repository

```bash
git clone https://github.com/YOUR_USERNAME/NotesApp.git
cd NotesApp
```

---

### 💻 2. Run Backend (ASP.NET Core)

```bash
cd notes-backend
dotnet restore
dotnet run
```

Backend runs at:  
📡 `https://localhost:44358`

> Make sure this port matches your launch profile in `launchSettings.json`

---

### 🌐 3. Run Frontend (React.js)

```bash
cd ../notes-frontend
npm install
npm run dev
```

Frontend runs at:  
🔗 `http://localhost:5173`

> You can change this port in `vite.config.js` if needed.

---

## 🔐 Features

### ✅ Note Management
- Create, Edit, Delete Notes
- Markdown-style content supported (optional)
  
### 🔐 Password-Protected Notes
- Passwords are hashed and stored securely
- Notes can be protected on **create only**
- Metadata stored in `.meta.json` file alongside note

### 🗣️ Voice to Text
- Microphone support to speak and auto-generate note content

### 🗃️ Metadata Support
- Each note saves `createdAt` and `updatedAt` timestamps
- Stored in `.meta.json` file for each note

### 🛡️ Unsaved Changes Protection
- Custom confirmation dialog if you try to switch without saving

---

## 📦 Backend Endpoints

| Method | Endpoint                          | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | `/api/notes/detailed`             | Get all notes             |
| GET    | `/api/notes/{fileName}`           | Get single note content   |
| POST   | `/api/notes`                      | Create a new note         |
| PUT    | `/api/notes/{fileName}`           | Update existing note      |
| DELETE | `/api/notes/{fileName}`           | Delete a note             |

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React.js + Vite
- Tailwind CSS
- SpeechRecognition API (for voice input)

### ⚙️ Backend
- ASP.NET Core Web API
- File-based storage system
- JSON & metadata management

---

## 🌐 Live Demo (Coming Soon)

- Frontend on Vercel 🔗
- Backend on Render or Railway ⚙️

---

## 👤 Author

- **Pooja Shree**  
- [GitHub Profile](https://github.com/Pojashri)

---

## 🤝 Contributions

Pull requests and suggestions are welcome.  
Let's build together! 🧡


