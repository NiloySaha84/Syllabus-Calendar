Syllabus Calendar
Transform your syllabus into a smart, interactive calendar with automatic event extraction and Google Calendar synchronization.
🚀 Features
Core Features (MVP)

File Upload: Support for PDF and text syllabus files
Smart Parsing: Automatically extract dates, assignments, exams, and readings
Calendar & List Views: Multiple ways to visualize your schedule
Event Editing: Click any event to edit title, type, date, and description
Event Categorization: Automatic classification into assignments, exams, readings, and other events

Bonus Features

Google Calendar Sync: Direct synchronization with your Google Calendar
Export to .ics: Download calendar file for Outlook, Apple Calendar, etc.
AI Enhancement: Uses OpenAI API for improved event classification (optional)
Responsive Design: Works seamlessly on desktop and mobile devices
Color-coded Events: Visual distinction between different event types

🛠 Tech Stack

Frontend: Next.js 14 with TypeScript and TailwindCSS
Backend: Next.js API routes with Node.js
Parsing: pdf-parse for PDF extraction, chrono-node for date parsing
Calendar: react-big-calendar for calendar visualization
AI: OpenAI API for enhanced event classification
OAuth: Google APIs for calendar synchronization
Deployment: Optimized for Vercel

📋 Prerequisites

Node.js 18+ and npm/yarn
Optional: OpenAI API key for enhanced parsing
Optional: Google OAuth credentials for calendar sync

🔧 Setup Instructions
1. Clone and Install
bashgit clone <repository-url>
cd syllabus-calendar
npm install
2. Environment Configuration
Copy the example environment file:
bashcp .env.example .env.local
Configure your environment variables in .env.local:
Required (none - app works without any API keys)
The app will work with basic functionality using regex-based parsing and local state management.
Optional - OpenAI API (Recommended)
bashOPENAI_API_KEY=your_openai_api_key_here
Enables AI-powered event classification for better accuracy.
Optional - Google Calendar Sync
bashGOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
To set up Google OAuth:

Go to Google Cloud Console
Create a new project or select existing one
Enable the Google Calendar API
Create OAuth 2.0 credentials
Add authorized redirect URIs: http://localhost:3000/auth/callback and your production URL

3. Run Development Server
bashnpm run dev
Open http://localhost:3000 in your browser.
4. Build for Production
bashnpm run build
npm start
🚀 Deployment (Vercel)
This project is optimized for Vercel deployment:

Push to GitHub and connect to Vercel
Set Environment Variables in Vercel dashboard
Deploy - Vercel will automatically build and deploy

Vercel Configuration
The project includes:

next.config.js configured for server-side PDF parsing
API routes optimized for serverless functions
Static file optimization for fast loading

📖 How It Works
1. File Upload & Parsing
PDF/TXT File → pdf-parse → Text Extraction → Date Detection (chrono-node) → Event Classification
2. Hybrid Parsing Approach

Regex/Rule-based: Fast local parsing for common patterns
AI Enhancement: OpenAI API for improved classification and context understanding
Date Extraction: chrono-node handles complex date formats ("March 15", "Week of Sept 10", etc.)

3. Event Classification
Events are automatically categorized based on keywords:

Assignments: homework, project, paper, due, submit
Exams: exam, test, quiz, midterm, final
Readings: reading, chapter, pages, textbook, article
Other: everything else

4. Calendar Integration

Visual Calendar: Interactive month/week/day views with react-big-calendar
List View: Sortable, filterable event list
Google Sync: OAuth2 flow for calendar integration
Export Options: .ics file generation for universal compatibility

🎯 Usage Guide
Basic Usage

Upload your syllabus (PDF or TXT)
Review automatically extracted events
Edit any events by clicking on them
Switch between calendar and list views

Advanced Features

Google Calendar Sync:

Click "Sync to Google Calendar"
Authorize the application
Events appear in your Google Calendar with color coding


Export to Other Calendars:

Click "Download .ics file"
Import the file into Outlook, Apple Calendar, etc.


Event Management:

Click any event to edit details
Change type, date, title, or description
Delete unwanted events



🔍 Project Structure
src/
├── app/
│   ├── api/
│   │   ├── parse/route.ts          # PDF/text parsing endpoint
│   │   └── google-calendar/route.ts # Google Calendar sync
│   ├── globals.css                 # Global styles & calendar CSS
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main application page
├── components/
│   ├── CalendarView.tsx            # Interactive calendar component
│   ├── EventEditor.tsx             # Event editing modal
│   ├── EventList.tsx               # List view component
│   ├── FileUpload.tsx              # Drag-and-drop file upload
│   └── GoogleCalendarSync.tsx      # Google Calendar integration
├── lib/
│   └── parser.ts                   # Core parsing logic
└── types/
    └── index.ts                    # TypeScript type definitions
🎨 Design Principles
User Experience

Intuitive Interface: Drag-and-drop upload, familiar calendar views
Visual Feedback: Loading states, success/error messages
Mobile Responsive: Works on all device sizes
Accessibility: Proper contrast, keyboard navigation

Performance

Serverless Optimized: API routes work efficiently on Vercel
Client-side State: Minimal API calls after initial parsing
Lazy Loading: Components load only when needed

Reliability

Error Handling: Graceful fallbacks for parsing failures
Duplicate Detection: Automatic removal of duplicate events
Data Validation: Input sanitization and type checking

🐛 Troubleshooting
Common Issues
"No events found"

Ensure your syllabus contains recognizable dates
Try different date formats (MM/DD, Month Day, etc.)
Check that file uploaded successfully

PDF parsing fails

Verify PDF contains extractable text (not just images)
Try converting to TXT format as alternative
Check file size limits

Google Calendar sync issues

Verify OAuth credentials are correct
Check redirect URIs match exactly
Ensure Calendar API is enabled in Google Cloud Console

Development Issues
Build errors with pdf-parse
bash# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
API route timeouts

Check OpenAI API key is valid
Verify file size is reasonable (<10MB)
Test with simpler syllabus first

🚀 Future Enhancements

Recurring Events: Support for "every Monday" type events
Multiple Syllabi: Merge calendars from multiple courses
Notifications: Email/SMS reminders for upcoming events
Team Collaboration: Share calendars with classmates
Mobile App: Native iOS/Android applications

🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature-name
Make changes and test thoroughly
Submit a pull request with clear description

📝 License
MIT License - feel free to use this project for personal or commercial purposes.
🆘 Support
For issues, questions, or feature requests:

Check the troubleshooting section above
Search existing GitHub issues
Create a new issue with detailed description


Built with ❤️ using Next.js, TypeScript, and modern web technologies.