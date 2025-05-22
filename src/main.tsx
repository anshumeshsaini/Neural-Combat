
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any existing content in the root element
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = '';
  createRoot(rootElement).render(<App />);
}
