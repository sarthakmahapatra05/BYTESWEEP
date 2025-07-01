import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </>
  </StrictMode>
); 