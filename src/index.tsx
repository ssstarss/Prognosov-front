import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const domNode = document.getElementById('root');
let root;
if (domNode) root = createRoot(domNode);

root?.render(  <StrictMode>
  <App />
</StrictMode>);
