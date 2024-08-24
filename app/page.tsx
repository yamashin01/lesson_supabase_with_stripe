import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import { cookies } from "@/node_modules/next/headers";
import Link from "@/node_modules/next/link";

const supabase = createServerComponentClient<Database>({ cookies });
const getAllLessons = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");
  return lessons;
};

export default async function Home() {
  const lessons = await getAllLessons();

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
