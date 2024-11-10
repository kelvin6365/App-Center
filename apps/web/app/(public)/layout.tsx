import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Content from "../../components/content/content";
interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  console.log("=============[Public Layout]============");
  console.log("session", session);

  return (
    <>
      <Content>
        <main className="w-full">{children}</main>
      </Content>
    </>
  );
}
