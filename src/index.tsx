import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';
import initStartValues from './functions/initStartValues';

const domNode = document.getElementById('root');
let root;
if (domNode) root = createRoot(domNode);
initStartValues();
root?.render(<App />);
