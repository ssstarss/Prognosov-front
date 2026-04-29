import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorNotifications from './Components/common/notifications/ErrorNotifications';
import GlobalLoadingOverlay from './Components/common/GlobalLoadingOverlay';
import { installFetchLoadingTracker } from './context/loadingStore';
import './fonts/DrukCur/stylesheet.css';
import './fonts/Manrope/stylesheet.css';
import './main.scss';


// При перезагрузке страницы переходим на стартовую (нет токена — данные не подгрузятся)
const navEntry = window.performance?.getEntriesByType?.('navigation')[0] as
  | PerformanceNavigationTiming
  | undefined;
if (navEntry?.type === 'reload') {
  window.location.replace(window.location.origin + '/');
} else if (window.location.pathname !== '/' && window.location.pathname !== '') {
  const hashPart = window.location.hash || window.location.pathname;
  window.location.replace(window.location.origin + '/' + hashPart);
}

const domNode = document.getElementById('root');
let root;
if (domNode) root = createRoot(domNode);

installFetchLoadingTracker();

root?.render(
  <>
    <App />
    <GlobalLoadingOverlay />
    <ErrorNotifications />
  </>
);
