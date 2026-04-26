import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/require-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/");
  }
  return <div className="min-h-0 flex-1">{children}</div>;
}
