import { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../util/store/store';

type Props = {
  children: React.ReactNode;
  auth: boolean;
};

const Guard = ({ children, auth }: Props) => {
  const location = useLocation();
  const isLoggedIn = useAppStore((state: any) => state.isLoggedIn);
  console.log(
    '[Init] Auth Guard',
    `\n auth: ${auth}`,
    `\n isLoggedIn: ${isLoggedIn}`,
    `\n location.pathname: ${location.pathname}`
  );
  if (auth) {
    if (location?.pathname === '/' || location == null) {
      if (isLoggedIn) {
        console.log('[Init] Navigating to /apps');
        return <Navigate to="/apps" replace></Navigate>;
      } else {
        console.log('[Init] Redirecting to login');
        return <Navigate to="/login" replace></Navigate>;
      }
    } else {
      if (!isLoggedIn && location?.pathname !== '/login') {
        console.log('[Init] Redirecting to login');
        return <Navigate to="/login" replace></Navigate>;
      }
    }
  }

  return <Suspense>{children}</Suspense>;
};

export default Guard;
