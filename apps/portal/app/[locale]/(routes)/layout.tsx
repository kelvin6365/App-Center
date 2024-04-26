// 'use client';
// import Content from '@/components/content/content';
// import PageContent from '@/components/content/pageContent';
// import Header from '@/components/navbar/header';
// import Sidebar from '@/components/navbar/sidebar';
// import { UserStatus } from '@/types/UserStatus';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import Loading from '../../../components/loading';
// import useUserProfileQuery from '../../../queries/useUserProfileQuery';
// const Layout = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const { userProfile } = useUserProfileQuery();
//   console.log(session);
//   useEffect(() => {
//     if (status === 'loading') return;

//     if (status === 'unauthenticated') {
//       router.replace('/login');
//     } else if (userProfile?.status === UserStatus.Pending) {
//       router.replace('/onboarding');
//     }
//   }, [status, session, router, userProfile]);

//   if (status === 'loading') {
//     return <Loading fullScreen />;
//   }

//   if (status === 'unauthenticated') {
//     return null;
//   }

//   return (
//     <>
//       <Header />
//       <Content>
//         <Sidebar />
//         <main className="w-full pt-16">
//           <PageContent>{children}</PageContent>
//         </main>
//       </Content>
//     </>
//   );
// };

// export default Layout;
import Content from '@/components/content/content';
import PageContent from '@/components/content/pageContent';
import Header from '@/components/navbar/header';
import Sidebar from '@/components/navbar/sidebar';
import { UserStatus } from '@/types/UserStatus';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/options';
interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  console.log('=============[getServerSession]============');
  console.log('session', session);

  if (!session) {
    redirect('/login');
  }

  if (session?.user?.status === UserStatus.Pending) {
    redirect('/onboarding');
  }

  return (
    <>
      <Header />
      <Content>
        <Sidebar />
        <main className="w-full pt-16">
          <PageContent>{children}</PageContent>
        </main>
      </Content>
    </>
  );
}
