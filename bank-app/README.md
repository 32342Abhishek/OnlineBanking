# Banking Application

A full-stack banking application with a React frontend and Spring Boot backend.

## Features Implemented

### Account Management
- **Zero Balance Account**: Open a basic account with no minimum balance requirement
- **Joint Account**: Open a joint account with family or business partners with different operation modes
- **Digital Account**: Paperless account opening with digital documentation

### Payment Services
- **Utility Bills**: Pay various utility bills (electricity, water, gas, etc.)
- **Mobile Recharge**: Recharge prepaid mobile or pay postpaid bills

### Account Dashboard
- View account balances and transaction history
- Fund transfers between accounts
- Account statements and details

## Upcoming Features

### Additional Account Types
- Current Account for businesses
- Salary Account for salaried individuals
- Senior Citizen Account with special benefits

### More Payment Services
- DTH Recharge
- Tax Payments
- Education Fees

### Loan Services
- Personal Loan Application
- Home Loan Application
- Car Loan Application

### Investment Services
- Fixed Deposits
- Recurring Deposits
- Mutual Funds

## Technical Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

### Backend
- Spring Boot
- Spring Security for authentication
- JPA/Hibernate for database operations
- MySQL database

## Setup Instructions

### Frontend
1. Navigate to the `bank-app` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at http://localhost:5174

### Backend
1. Navigate to the backend directory
2. Build the application: `./mvnw clean install`
3. Run the application: `./mvnw spring-boot:run`
4. The API will be available at http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Accounts
- `GET /api/accounts` - Get all accounts for current user
- `GET /api/accounts/{id}` - Get account by ID
- `POST /api/accounts` - Create a new account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Close account

### Transactions
- `GET /api/transactions` - Get all transactions for current user
- `GET /api/accounts/{accountId}/transactions` - Get transactions for specific account
- `POST /api/transactions` - Create a new transaction

## Contact

For any questions or issues, please contact [your-email@example.com](mailto:your-email@example.com).
