import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("=============[Global Page]============");
  if (!session) {
    redirect("/login");
  } else {
    redirect("/console");
  }
}
