import { auth } from "@/lib/auth";
import BlogForm from "./BlogForm";

export default async function NewBlogPage() {
  const session = await auth();
  return (
    <div>
      <a href="/dashboard/blog" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>← Retour au blog</a>
      <h1 style={{ color: "#001459", fontSize: "24px", fontWeight: "700", margin: "16px 0 24px" }}>Nouvel article</h1>
      <BlogForm authorId={session?.user?.id || ""} />
    </div>
  );
}
