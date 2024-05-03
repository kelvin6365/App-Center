import Content from '@/components/content/content';
import PageContent from '@/components/content/pageContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/options';
interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  console.log('=============[getServerSession]============');
  console.log('=============[Install Page]============');
  console.log('session', session);

  return (
    <>
      <Content>
        <main className="w-full">{children}</main>
      </Content>
    </>
  );
}
