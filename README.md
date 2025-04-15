# Agritech Frontend

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JeyllonSandoval/agritech-frontend
cd agritech-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📝 Project Description

Agritech Frontend is a modern web application built to support agricultural technology solutions. The project aims to provide a user-friendly interface for managing and monitoring agricultural operations, integrating with various backend services and APIs.

### Why This Project?

This project was created to address the growing need for digital solutions in the agricultural sector. It provides farmers and agricultural professionals with tools to:
- Monitor and manage agricultural operations
- Access real-time data and analytics
- Streamline agricultural processes
- Improve decision-making through data-driven insights

## 🧠 Base Logic

The project follows a modular architecture with the following key components:

- **Frontend**: Built with Next.js for server-side rendering and optimal performance
- **State Management**: Uses Zustand for efficient state management
- **Styling**: Implements Tailwind CSS for responsive and modern UI design
- **Authentication**: JWT-based authentication system
- **Media Handling**: Cloudinary integration for image and media management

The application is structured into modules that handle different aspects of agricultural operations, making it scalable and maintainable.

## 🛠️ Technologies Used

### Core Technologies
- **Next.js 15.1.6**: React framework for server-side rendering
- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: For type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management solution

### Key Dependencies
- **@heroicons/react**: Icon library
- **framer-motion**: Animation library
- **jwt-decode**: JWT token handling
- **react-icons**: Icon library
- **cloudinary**: Cloud-based media management

### Development Tools
- **PostCSS**: CSS processing
- **TypeScript**: Type checking and development
- **ESLint**: Code linting

## 📁 Project Structure

```
src/
├── app/          # Next.js app router pages and layouts
├── modules/      # Feature modules and business logic
├── middleware/   # Authentication and request middleware
public/           # Static assets
```
