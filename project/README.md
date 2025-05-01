# AgriGuard AI Assistant

AgriGuard is an AI-powered agricultural assistant that helps farmers with crop management, disease detection, and task scheduling. It uses Google's Gemini AI to provide expert advice on farming practices.

## Features

- **Image Analysis**: Upload crop and soil images for AI-powered analysis
- **Expert Advice**: Get detailed recommendations for crop care and management
- **Task Scheduling**: Manage watering, fertilizing, and pesticide application schedules
- **Real-time Assistance**: Get instant answers to your farming questions

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Chat Interface
- Upload images of crops or soil for analysis
- Ask questions about farming practices
- Get detailed recommendations and advice

### Scheduler
- Add tasks for watering, fertilizing, or pesticide application
- View tasks in a weekly calendar
- Mark tasks as completed
- Get reminders for upcoming tasks

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Google Gemini AI
- date-fns

## Contributing

Feel free to submit issues and enhancement requests! 