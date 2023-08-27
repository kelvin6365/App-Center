import { ThemeProvider } from '@material-tailwind/react';
import moment from 'moment';
import 'moment-timezone';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import route from './app/routes/route';
import { ignoreWarning } from './app/util/util';
ignoreWarning();
moment.tz.setDefault(moment.tz.guess());
const routes = route();
const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
if (import.meta.env.VITE_ENV !== 'prod') {
  console.log('[ENV]', import.meta.env.VITE_ENV);
  console.log('[API]', import.meta.env.VITE_API_HOST);
}
root.render(
  <ThemeProvider>
    <ToastContainer style={{ zIndex: 99999 }} />
    <RouterProvider router={router} />
  </ThemeProvider>
);
