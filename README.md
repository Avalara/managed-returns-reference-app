# Managed Returns Reference App - A React-based Tax Return Management Interface

The Managed Returns Reference App is a comprehensive web application that streamlines tax return management and reconciliation processes. It provides a modern, user-friendly interface for managing tax returns, data ingestion, and account provisioning while integrating seamlessly with Avalara's tax services.

This application serves as a reference implementation for integrating with Avalara's tax return management services. It features a robust authentication system, data ingestion capabilities for transactions and tax liability data, and comprehensive tax return reconciliation workflows. Built with React and Apollo Client, it demonstrates best practices for building scalable tax management interfaces while providing developers with clear integration patterns.

## Repository Structure
```
.
├── src/                          # Source code directory
│   ├── components/              # React components organized by feature
│   │   ├── Authentication/      # Authentication-related components
│   │   ├── DataIngest/         # Data import and history components
│   │   ├── ReconcileYourReturns/ # Tax return reconciliation components
│   │   └── shared/             # Shared/reusable components
│   ├── graphql/                # GraphQL queries and mutations
│   │   ├── auth/              # Authentication-related GraphQL operations
│   │   ├── mutations/         # GraphQL mutations
│   │   └── queries/          # GraphQL queries
│   └── routes/                # React Router route components
├── Dockerfile                  # Multi-stage Docker build configuration
├── nginx/                     # NGINX configuration for production deployment
└── vite.config.js            # Vite build and development configuration
```

## Usage Instructions
### Prerequisites
- Node.js 20.x or later
- npm 8.x or later
- Docker (for containerized deployment)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd managed-returns-reference-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Quick Start
1. Select Company:
```javascript
// Navigate to /developer-tools/authentication
// Select your company from the dropdown menu
```

2. Import Data:
```javascript
// Navigate to /developer-tools/data-ingest
// Choose import type (Transactions or Summarized tax liability)
// Upload CSV or XLSX file (max 28MB, 100,000 rows)
```

### More Detailed Examples
1. Reconciling Returns:
```javascript
// Navigate to /returns/reconcile
// Select filing period
// Review return status and amounts
// Access detailed view by clicking on specific returns
```

2. Data Import:
```javascript
// Example CSV format for transaction data:
"TransactionId,Date,Amount,TaxAmount"
"T-001,2023-01-01,1000.00,80.00"

// Example XLSX format for tax liability:
// Sheet1: Summary
// Sheet2: Details
```

### Troubleshooting
1. Authentication Issues:
- Error: "Unable to authenticate"
  ```javascript
  // Check browser console for detailed error messages
  // Verify clientId and clientSecret in localStorage
  // Clear browser cache and reload
  ```

2. Data Import Failures:
- Error: "File upload failed"
  ```javascript
  // Verify file size is under 28MB
  // Check file format (CSV/XLSX)
  // Ensure column headers match template
  ```

## Data Flow
The application manages tax return data through a series of transformations from raw transaction data to reconciled returns.

```ascii
[User Input] -> [Data Ingest] -> [Apollo Client] -> [GraphQL API]
                                       ↓
[Display] <- [React Components] <- [State Management]
```

Key component interactions:
1. Authentication service validates credentials and maintains session
2. Apollo Client manages GraphQL operations and caching
3. React Router handles navigation and route-based data loading
4. Data Ingest component processes file uploads and validates data
5. ReconcileYourReturns component displays and manages return status

## Infrastructure

![Infrastructure diagram](./docs/infra.svg)
### Docker Resources
- `nginx:1.27-alpine`: Production web server
  - Serves static assets from `/usr/share/nginx/html`
  - Configured via `/etc/nginx/conf.d/default.conf`
  - Exposes port 80

### Build Resources
- `node:20`: Build environment
  - Executes npm ci for dependency installation
  - Runs build process via npm run build
  - Outputs to /app/dist
