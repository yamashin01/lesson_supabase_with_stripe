import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerComponentClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import { cookies } from "@/node_modules/next/headers";
import Link from "@/node_modules/next/link";

export default async function Home() {
  const supabase = createServerComponentClient({cookies});
  const { data: lessons } = await supabase.from("lesson").select("*");

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-3">
        {lessons?.map((lesson) => (
          <Link href={`/${lesson.id}`} key={lesson.id}>
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
