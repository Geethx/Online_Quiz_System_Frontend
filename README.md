# Online Quiz System - Frontend

A modern, full-stack online quiz and assignment management system built with React and Spring Boot. This is the frontend application that provides an intuitive interface for managing questions, creating assignments, and taking timed quizzes.

## Features

- **Question Management**: Create, edit, and manage multiple-choice questions with difficulty levels and points
- **Assignment Creation**: Build custom assignments by selecting questions with start/end time scheduling
- **Timed Quizzes**: Take assignments with countdown timers and auto-submission
- **Mark for Review**: Flag questions during quiz attempts for later review
- **Real-time Validation**: Instant feedback on time constraints and duration limits
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly interface
- **Question Palette**: Navigate easily between questions during quiz attempts

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Backend API**: The Spring Boot backend must be running on `http://localhost:8080`

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Geethx/Online_Quiz_System_Frontend.git
   cd Online_Quiz_System_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:8080`. If your backend is running on a different port or host, update the API base URL in:

- `src/services/api.js`

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
quiz-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Home.jsx         # Landing page
│   │   ├── QuestionList.jsx # View all questions
│   │   ├── QuestionForm.jsx # Create/edit questions
│   │   ├── AssignmentList.jsx # View all assignments
│   │   ├── AssignmentForm.jsx # Create/edit assignments
│   │   ├── AvailableAssignments.jsx # Student view
│   │   ├── AssignmentAttempt.jsx # Quiz taking interface
│   │   └── AttemptResults.jsx # View results
│   ├── services/            # API service layers
│   │   ├── api.js           # Axios configuration
│   │   ├── questionService.js
│   │   ├── assignmentService.js
│   │   └── attemptService.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles (Tailwind)
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Axios 1.13** - HTTP client for API calls
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code linting and quality

## Key Features Implementation

### Timer Logic

- Countdown timer with auto-submission when time expires
- Uses `useRef` to prevent infinite re-renders
- Saves answers automatically to backend

### Question Navigation

- Question palette showing all questions
- Mark questions for review
- Visual indicators for answered/unanswered questions

### Time Validation

- Start time must be in the future
- End time must be after start time
- Duration cannot exceed assignment time window
- Real-time validation feedback

## API Integration

The frontend communicates with the Spring Boot backend through RESTful APIs:

- **Questions API**: `/api/questions`
- **Assignments API**: `/api/assignments`
- **Attempts API**: `/api/attempts`

All API calls include CORS headers configured for `http://localhost:5173`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of an academic assignment.

## Related Repositories

- **Backend**: [Online_Quiz_System_Backend](https://github.com/Geethx/Online_Quiz_System_Backend)

## Troubleshooting

### CORS Errors

Ensure the backend has CORS configured for `http://localhost:5173`

### API Connection Failed

Verify the backend is running on `http://localhost:8080`

### Tailwind Styles Not Working

Run `npm install` to ensure all dependencies are installed

### Port Already in Use

Change the port in `vite.config.js` or stop the process using port 5173

## Support

For issues or questions, please create an issue in the GitHub repository.
