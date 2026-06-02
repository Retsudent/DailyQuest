import { db } from "@/lib/db";

export default async function TestPage() {
  const users = await db.user.findMany();

  return (
    <div className="p-10">
      <h1>Total Users: {users.length}</h1>
    </div>
  );
}