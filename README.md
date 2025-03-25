# Managed Returns Reference App

## Code Formatting Setup

This project uses ESLint and Prettier for consistent code formatting. The configuration has been set up to ensure all developers follow the same coding style.

### Installation

To install the required dependencies:

```bash
npm install
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code style issues
- `npm run format` - Run Prettier to format all JavaScript and JSX files
- `npm run preview` - Preview the production build
- `npm run test` - Run tests

### Pre-commit Hooks

A pre-commit hook has been set up using Husky to ensure all committed code follows the style guidelines. The hook will:
1. Run ESLint to fix any fixable issues
2. Run Prettier to format the code

### Coding Standards

The ESLint configuration enforces:
- React best practices
- Consistent JSX formatting
- Proper prop types usage
- Consistent spacing, indentation, and bracket placement

### Manual Setup

If you need to manually install the formatting tools:

```bash
npm install --save-dev eslint-plugin-prettier prettier
```

Then run:

```bash
npm run lint
npm run format
```