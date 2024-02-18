'use client';
import Content from '@/components/content/content';
import PageContent from '@/components/content/pageContent';
import Header from '@/components/navbar/header';
import Sidebar from '@/components/navbar/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    router.push('login');
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
};

export default Layout;
