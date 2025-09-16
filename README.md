# Syllabus Calendar

A Next.js application that transforms academic syllabi into interactive, smart calendars. Upload a PDF or text syllabus and automatically extract assignments, exams, readings, and other important dates into a beautiful calendar interface with Google Calendar synchronization.

## 🚀 Features

### Core Features
- **File Upload Support**: Upload PDF or text syllabus files via drag-and-drop interface
- **Smart Date Extraction**: Automatically parse various date formats using chrono-node
- **Event Classification**: AI-powered categorization of assignments, exams, readings, and other events
- **Interactive Calendar**: Beautiful calendar views (month, week, day, agenda) using react-big-calendar
- **Event Editing**: Click-to-edit functionality for all event details
- **Multiple Views**: Switch between calendar and list views

### Advanced Features
- **Google Calendar Sync**: Direct OAuth2 integration for seamless calendar synchronization
- **ICS Export**: Download calendar files for Outlook, Apple Calendar, and other applications
- **AI Enhancement**: Optional OpenAI integration for improved event classification
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Color-coded Events**: Visual distinction between different event types

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **PDF Parsing**: pdf-parse library
- **Date Processing**: chrono-node for natural language date parsing
- **Calendar UI**: react-big-calendar with moment.js localizer
- **AI Integration**: OpenAI API for enhanced classification
- **Authentication**: Google OAuth2 for calendar sync
- **Deployment**: Optimized for Vercel

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Optional: OpenAI API key for enhanced parsing
- Optional: Google OAuth credentials for calendar sync

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repository-url>
cd syllabus-calendar
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env .env.local
```

Configure the following environment variables:

#### Optional - OpenAI API (Recommended for better accuracy)
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

#### Optional - Google Calendar Integration
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Note**: The application will work with basic functionality even without API keys, using regex-based parsing and local state management.

### 3. Google OAuth Setup (Optional)

If you want Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment (Vercel)

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set your environment variables in the Vercel dashboard
4. Deploy - Vercel will automatically build and deploy your application

The project includes proper configuration for serverless functions and optimized build settings.

## 🔍 My Approach

### Problem Analysis
I identified that students often struggle to keep track of important dates from their syllabi. Traditional methods involve manual calendar entry, which is time-consuming and error-prone. My solution automates this process while providing flexibility for manual adjustments.

### Technical Architecture

#### 1. File Processing Pipeline
- **PDF Parsing**: Used pdf-parse to extract text from PDF files
- **Text Processing**: Implemented text cleaning and normalization
- **Date Detection**: Leveraged chrono-node for robust natural language date parsing
- **Event Classification**: Created rule-based classification with optional AI enhancement

#### 2. Hybrid Parsing Strategy
I implemented a multi-layered approach:

**Layer 1: Rule-based Classification**
- Fast, reliable parsing using regex patterns
- Keyword matching for event types (assignment, exam, reading, other)
- Handles common academic terminology and date formats

**Layer 2: AI Enhancement (Optional)**
- OpenAI GPT-3.5 integration for context-aware classification
- Improves accuracy for ambiguous or complex syllabi
- Graceful fallback to rule-based parsing if AI fails

**Layer 3: Post-processing**
- Duplicate detection and removal
- Date validation (academic year range filtering)
- Event title extraction and cleanup

#### 3. User Experience Design
- **Progressive Enhancement**: Core functionality works without any external APIs
- **Intuitive Interface**: Familiar drag-and-drop upload with clear visual feedback
- **Flexible Viewing**: Multiple calendar views to suit different preferences
- **Easy Editing**: Click-to-edit functionality for quick adjustments

#### 4. Integration Strategy
- **Google Calendar Sync**: Full OAuth2 flow for secure calendar integration
- **Universal Export**: ICS file generation for compatibility with all calendar applications
- **Color Coding**: Visual distinction between event types for quick recognition

### Key Technical Decisions

#### Why Next.js?
- Server-side PDF processing capabilities
- API routes for secure credential handling
- Excellent performance with static optimization
- Seamless Vercel deployment

#### Why chrono-node?
- Handles diverse date formats ("March 15", "Week of Sept 10", "3/15/24")
- Robust natural language processing
- Better than regex-only approaches for academic content

#### Why react-big-calendar?
- Professional calendar interface
- Multiple view options
- Excellent customization capabilities
- Good mobile responsiveness

### Error Handling and Reliability
- Comprehensive error handling at each parsing stage
- Graceful degradation when APIs are unavailable
- Input validation and sanitization
- Clear user feedback for all error states

### Performance Optimizations
- Client-side state management to minimize API calls
- Efficient PDF processing with proper memory management
- Lazy loading of components
- Optimized bundle size with dynamic imports

## 📖 How It Works

1. **File Upload**: User uploads PDF or text syllabus
2. **Text Extraction**: Server processes file and extracts raw text
3. **Date Detection**: chrono-node identifies potential dates
4. **Event Classification**: Rule-based + optional AI classification
5. **Duplicate Removal**: Smart deduplication based on dates and content
6. **Calendar Display**: Interactive calendar with editing capabilities
7. **Export/Sync**: Google Calendar integration or ICS download

## 🎯 Usage Guide

### Basic Workflow
1. Upload your syllabus (PDF or TXT format)
2. Review automatically extracted events
3. Edit any events by clicking on them
4. Switch between calendar and list views
5. Export to your preferred calendar application

### Advanced Features
- **Google Calendar Sync**: Authorize and sync events directly
- **Bulk Editing**: Efficient event management interface
- **Export Options**: Download ICS files for universal compatibility

## 🐛 Troubleshooting

### Common Issues

**"No events found"**
- Ensure your syllabus contains recognizable dates
- Try different date formats or add year information
- Verify the file uploaded successfully

**PDF parsing failures**
- Ensure PDF contains extractable text (not scanned images)
- Try converting to TXT format as alternative
- Check file size (recommended <10MB)

**Google Calendar sync issues**
- Verify OAuth credentials are correctly configured
- Check that redirect URIs match exactly
- Ensure Google Calendar API is enabled

## 🚀 Future Enhancements

- **Recurring Events**: Support for "every Monday" type events
- **Multi-syllabus Support**: Merge calendars from multiple courses
- **Smart Notifications**: Email/SMS reminders
- **Collaboration Features**: Share calendars with classmates
- **Mobile App**: Native iOS/Android applications

## 📝 License

MIT License - Feel free to use this project for personal or educational purposes.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.