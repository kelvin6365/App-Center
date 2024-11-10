import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("=============[getServerSession]============");
  console.log("=============[Install Page]============");
  console.log("session", session);
  if (!session) {
    redirect("/login");
  } else {
    redirect("/console");
  }
}
