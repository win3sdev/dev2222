import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authConfig"

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/review-611/dashboard");
  } else {
    redirect("/review-611/login");
  }
}
