import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminCookie } from "@/lib/adminAuth";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!verifyAdminCookie(cookieStore.get("admin_auth")?.value)) redirect("/admin/login");

  const stipendier = await prisma.stipendium.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminClient stipendier={stipendier} />;
}
