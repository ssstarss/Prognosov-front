import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorNotifications from './Components/common/notifications/ErrorNotifications';
import GlobalLoadingOverlay from './Components/common/GlobalLoadingOverlay';
import { installFetchLoadingTracker } from './context/loadingStore';
import './fonts/used-fonts.css';
import './fonts/Manrope/stylesheet.css';
import './main.scss';


// Не делаем replace('/') при F5: hash сбрасывался, была вторая загрузка,
// refresh с #/prognoses обрывался и refreshToken удалялся в catch.
const navEntry = window.performance?.getEntriesByType?.('navigation')[0] as
  | PerformanceNavigationTiming
  | undefined;
if (navEntry?.type !== 'reload' && window.location.pathname !== '/' && window.location.pathname !== '') {
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
