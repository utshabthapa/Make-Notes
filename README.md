# 📝 Make Notes - Full Stack Note Taking Application

A modern, full-featured note-taking application built with React.js frontend, Node.js backend, and MySQL database. Organize your thoughts, ideas, and tasks with an intuitive and responsive interface.

## ✨ Features

### 🔐 **Authentication & Security**

- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Session management with HTTP-only cookies

### 📋 **Note Management**

- Create, read, update, and delete notes
- Custom background colors for notes
- Real-time note updates

### 🏷️ **Organization & Categorization**

- Create and manage custom categories
- Assign multiple categories to notes
- Category-based filtering
- Archive and restore functionality

### ⭐ **Advanced Features**

- Pin important notes to the top
- Bookmark notes for quick access
- Advanced search functionality
- Sort by title, creation date, or modification date
- Mobile-responsive design

## 🛠️ Technologies Used

### **Frontend**

- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Vite** - Build tool and development server

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

### **Database**

- **MySQL** - Relational database

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **MySQL Server** (v8.0 or higher)
- **npm** package manager
- **Git**

## 🚀 Installation & Setup

### **1. Clone the Repository**

\`\`\`bash
git clone https://github.com/utshabthapa/Make-Notes.git
cd Make-Notes
\`\`\`

### **2. Database Setup**

#### **Using MySQL Workbench (Recommended)**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the SQL script file: `Backend/database/Make-Notes-Schema.sql`
4. Execute the entire script to create the database and tables

#### **Using MySQL Command Line**

\`\`\`bash

# Login to MySQL

mysql -u root -p

# Create database and tables

source Backend/database/Make-Notes-Schema.sql
\`\`\`

### **3. Backend Setup**

\`\`\`bash

# Navigate to backend directory

cd Backend

# Install dependencies

npm install
\`\`\`

#### **Configure Environment Variables**

Create a `.env` file in the `Backend` directory:

\`\`\`env

# Database Configuration

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=make_notes

# JWT Configuration

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=2592000000

# Server Configuration

PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)

FRONTEND_URL=http://localhost:5173
\`\`\`

**Important:** Replace `your_mysql_password` with your actual MySQL password and generate a strong JWT secret.

### **4. Frontend Setup**

\`\`\`bash

# Navigate to frontend directory (from project root)

cd Frontend

# Install dependencies

npm install
\`\`\`

## 🏃‍♂️ Running the Application

### **Start Backend Server**

\`\`\`bash

# From Backend directory

npm run dev

# Server will start on http://localhost:5000

\`\`\`

### **Start Frontend Development Server**

\`\`\`bash

# From Frontend directory (in a new terminal)

npm run dev

# Frontend will start on http://localhost:5173

\`\`\`

## 📚 API Documentation

Once the backend server is running, you can access the comprehensive API documentation at:

**🔗 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

The Swagger UI provides detailed information about all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

### **Frontend Access**

Open your browser and navigate to `http://localhost:5173`

## 👨‍💻 Author

**Utshab Thapa**

- GitHub: [@utshabthapa](https://github.com/utshabthapa)
- Project Link: [https://github.com/utshabthapa/Make-Notes](https://github.com/utshabthapa/Make-Notes)

---
