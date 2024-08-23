import { createServerComponentClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import { cookies } from "@/node_modules/next/headers";
import Link from "@/node_modules/next/link";

export default async function Home() {
  const supabase = createServerComponentClient({cookies});
  const { data: lessons } = await supabase.from("lesson").select("*");

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons?.map((lesson) => (
        <Link href={`/${lesson.id}`} key={lesson.id}>{lesson.title}</Link>
      ))}

    </main>
  );
}
