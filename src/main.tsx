import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<div style="color:#F85149;padding:40px;font-family:system-ui"><h1>Error: #root not found</h1></div>';
} else {
  try {
    const root = createRoot(rootEl);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (err) {
    rootEl.innerHTML = `<div style="color:#F85149;padding:40px;font-family:system-ui"><h1>React Error</h1><pre>${err}</pre></div>`;
    throw err;
  }
}
