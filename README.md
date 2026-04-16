# Canteen Management System

A full-stack, modern Canteen Management System designed to streamline food ordering, menu management, and canteen administration. The application features a sleek UI with a premium glassmorphism aesthetic and a robust backend API.

## Features
- **User Authentication**: Secure Registration and Login system.
- **Menu Management**: View, add, and manage menu items (`MenuDashboard`).
- **Order Processing**: Users can browse items and place orders, which are processed seamlessly.
- **Admin Dashboard**: A centralized dashboard for canteen administrators to oversee operations.
- **Theme Toggle**: Switch between light and dark modes easily for an improved user experience.
- **Responsive & Modern UI**: Built with a focused glassmorphism aesthetic and responsive design principles.

## Technology Stack

### Frontend
- **React.js**: Robust UI library (v19).
- **Vite**: Next-generation frontend tooling for faster, leaner development.
- **React Router**: For seamless single-page application navigation.
- **Axios**: Promise-based HTTP client for making API requests.
- **Lucide React**: Beautiful and consistent SVG icons.

### Backend
- **Spring Boot 3**: Powerful framework for building Java-based enterprise applications.
- **Spring Data JPA**: For streamlined database operations and ORM.
- **H2 Database**: Fast in-memory database for local development and testing.
- **Lombok**: Boilerplate reduction for Java classes.
- **Maven**: Dependency and build management.

## Project Structure
```text
Canteen-Management-System/
├── backend/            # Spring Boot application
│   ├── src/main/java   # Java source code (Controllers, Models, Services, etc.)
│   └── pom.xml         # Maven configuration
└── frontend/           # React + Vite application
    ├── src/            # Components, pages, and UI assets
    └── package.json    # Node dependencies and scripts
```

## Getting Started

### Prerequisites
- [Java 17](https://jdk.java.net/17/) or higher
- [Maven](https://maven.apache.org/)
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- npm or yarn

### 1. Running the Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start (usually on `http://localhost:8080`). The H2 console can typically be accessed via `/h2-console`.*

### 2. Running the Frontend
1. Open a **new** terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend server will start and provide a local URL (e.g., `http://localhost:5173`).*

## API Endpoints Overview
*(Examples of paths configured in the application)*
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to the system
- `GET /api/menu` - Retrieve all menu items
- `POST /api/orders` - Place a new order

---
*Developed as a modern solution for canteen automation and management.*
