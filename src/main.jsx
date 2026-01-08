import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import './index-clean.css'
import 'primeicons/primeicons.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <FlexibleScrollDemo />
  </StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}
