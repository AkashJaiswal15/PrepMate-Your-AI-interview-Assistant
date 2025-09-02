# PrepMate - AI Interview Assistant

A full-stack MERN application that helps users prepare for interviews with personalized AI-generated questions and feedback.

## Features

### 🔐 Authentication
- JWT-based login/signup system
- Password hashing with bcrypt
- Protected routes for dashboard and interview sessions

### 📄 Resume Processing
- Upload PDF/DOC resume files
- Automatic skill extraction and parsing
- Skills-based question generation

### 🤖 AI Interview Bot
- OpenAI integration for question generation
- Role-specific questions (Frontend, Backend, Full Stack, etc.)
- Real-time AI feedback on answers
- Voice input support using Web Speech API

### 📊 Dashboard & Analytics
- Session history with timestamps
- Progress tracking and metrics
- Pin important questions for review
- Performance scoring and improvement tracking

### 🎨 Modern UI/UX
- Responsive Bootstrap design
- Clean navigation and card layouts
- Loading states and form validation
- Mobile-friendly interface

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- PDF/DOC parsing libraries
- OpenAI API integration

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Bootstrap & React-Bootstrap
- Axios for API calls
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prepmate
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Resume
- `POST /api/resume/upload` - Upload and parse resume

### AI Interview
- `POST /api/ai/generate-questions` - Generate interview questions
- `POST /api/ai/submit-answer` - Submit answer for AI feedback
- `POST /api/ai/toggle-pin` - Pin/unpin questions

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/session/:id` - Get specific session

## Usage

1. **Register/Login**: Create an account or login
2. **Upload Resume**: Upload your resume for skill extraction
3. **Start Interview**: Choose role and difficulty level
4. **Answer Questions**: Type or use voice input for answers
5. **Get Feedback**: Receive AI-generated feedback and scoring
6. **Track Progress**: View session history and improvement metrics

## Project Structure

```
prepmate/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication middleware
│   ├── uploads/        # Resume file storage
│   └── server.js       # Express server
└── frontend/
    ├── src/
    │   ├── components/ # Reusable React components
    │   ├── pages/      # Page components
    │   ├── hooks/      # Custom hooks (auth)
    │   ├── utils/      # API utilities
    │   └── App.js      # Main app component
    └── public/         # Static files
```

## Future Enhancements

- [ ] PDF export of session summaries
- [ ] LinkedIn API integration
- [ ] Video interview practice
- [ ] Company-specific question sets
- [ ] Interview scheduling system
- [ ] Performance analytics dashboard
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.