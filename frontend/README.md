# UniLunch Frontend

This is the frontend project for UniLunch, built with React, Tailwind CSS, and Vite.

## Project Structure

```
frontend/
├── public/
│   └── assets/         # Static assets
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── layouts/       # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── context/       # React context providers
│   ├── styles/        # Custom styles
│   ├── App.jsx        # Main App component
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Tech Stack

- React
- React Router DOM
- Tailwind CSS
- Vite
- ESLint
- Prettier

## Development

- The project uses ESLint for code linting and Prettier for code formatting
- Tailwind CSS is configured and ready to use
- React Router is set up with a basic route configuration
- The project structure follows React best practices

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
