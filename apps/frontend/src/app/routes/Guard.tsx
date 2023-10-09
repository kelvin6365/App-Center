import { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../util/store/store';

type Props = {
  children: React.ReactNode;
  auth: boolean;
};

const Guard = ({ children, auth }: Props) => {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        console.log('[Init] Navigating to /apps/all');
        return <Navigate to="/apps/all" replace></Navigate>;
      } else {
        console.log('[Init] Redirecting to login', window.location.pathname);
        return <Navigate to="/login" replace></Navigate>;
      }
    } else {
      if (!isLoggedIn && location?.pathname !== '/login') {
        console.log('[Init] Redirecting to login', window.location.pathname);
        return (
          <Navigate
            to="/login"
            state={{
              redirectTo: location.pathname,
            }}
            replace
          ></Navigate>
        );
      }
    }
  } else {
    if (isLoggedIn) {
      console.log(
        '[Init] Redirecting to home',
        window.location.pathname,
        location.state
      );
      const { redirectTo } = location?.state ?? {};
      return <Navigate to={redirectTo ?? '/apps/all'} replace></Navigate>;
    }
  }

  return <Suspense>{children}</Suspense>;
};

export default Guard;
