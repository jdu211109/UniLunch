import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Обработка ошибок
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('share-modal.js')) {
    event.preventDefault();
    console.warn('Ignoring share-modal.js error - likely from browser extension');
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}
