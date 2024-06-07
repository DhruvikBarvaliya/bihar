# Material Requisition and Issuance API

## Project Description

This project is a backend API for managing material requisition and issuance in an organization. It includes user authentication, role-based access control, and various functionalities for handling requisitions, inventory, approvals, and email notifications.

## Features

- User registration and login with JWT authentication
- Role-based access control
- Material requisition and approval process
- Inventory management
- Email notifications
- Logging using Winston

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- Nodemailer for email sending
- Winston for logging

## Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/your-repo/material-requisition-api.git
cd material-requisition-api

#bash
npm install

#.env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=your_database_host
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
LOG_LEVEL=info
PORT=3000

#bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

#bash
npm run dev
