import Content from "../../components/content/content";
interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  console.log("=============[Public Layout]============");
  return (
    <>
      <Content>
        <main className="w-full">{children}</main>
      </Content>
    </>
  );
}
