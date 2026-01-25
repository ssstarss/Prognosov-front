import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';

const domNode = document.getElementById('root');
let root;
if (domNode) root = createRoot(domNode);
root?.render(<App />);
