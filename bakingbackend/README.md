# Apna Bank - Online Banking System

A complete Spring Boot backend for an Online Banking System with JWT-based authentication, multi-factor authentication, and comprehensive banking features.

## Features

### Authentication and Security
- JWT-based authentication
- Multi-factor authentication (email/OTP-based)
- Password encryption using BCrypt

### User Management
- Registration and login endpoints
- User roles (Admin, Customer)
- Profile management

### Account Management
- Create, update, delete bank accounts
- Support for multiple accounts per user
- View account balance and details

### Transactions
- Fund transfer between accounts
- View transaction history
- Download account statements

### Bill Payments
- Add/manage billers (e.g., electricity, water)
- Pay bills using account balance
- Set up recurring payments

### Loan Management
- Request loans
- View loan status and repayment history

## Technical Stack
- Spring Boot 3.4.5
- Spring Security with JWT Authentication
- Spring Data JPA for MySQL
- JavaMailSender for OTP-based MFA
- Validation using Jakarta Validation
- Exception Handling with @ControllerAdvice
- DTOs and Entity mapping
- MySQL Database

## Getting Started

### Prerequisites
- Java 21 or later
- Maven
- MySQL database

### Database Setup
1. Create a MySQL database named `apna_bank`
   ```sql
   CREATE DATABASE apna_bank;
   ```
   Note: If you have the `createDatabaseIfNotExist=true` parameter in the application.properties file, the database will be created automatically.

### Configuration
Update the application.properties file with your database credentials and email service configuration:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/apna_bank?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password

# Email Configuration (for OTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Building and Running the Application
1. Clone the repository
2. Navigate to the project directory
3. Build the project:
   ```
   mvn clean install
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```
   
The application will start on port 8080.

## API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/verify-otp` - Verify OTP for MFA

### Account Endpoints
- `POST /api/v1/accounts` - Create a new account
- `GET /api/v1/accounts` - Get all accounts for the current user
- `GET /api/v1/accounts/{id}` - Get account by ID
- `GET /api/v1/accounts/number/{accountNumber}` - Get account by account number
- `PUT /api/v1/accounts/{id}` - Update account details
- `DELETE /api/v1/accounts/{id}` - Close an account

### Transaction Endpoints
- `POST /api/v1/transactions/transfer` - Transfer funds between accounts
- `GET /api/v1/transactions/account/{accountNumber}` - Get transactions for an account
- `GET /api/v1/transactions/account/{accountNumber}/date-range` - Get transactions within a date range

For a complete list of endpoints and request/response formats, run the application and visit `/swagger-ui/index.html`.

## Security
The application implements the following security measures:
- JWT token-based authentication
- Role-based access control
- Password encryption with BCrypt
- Multi-factor authentication with time-based OTP
- HTTPS support (configure in production)

## License
This project is licensed under the MIT License. 