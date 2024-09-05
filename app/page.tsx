import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import Link from "@/node_modules/next/link";
import { supabaseServer } from "./utils/supabaseServer";

const getAllLessons = async (supabase: SupabaseClient) => {
  const { data: lessons } = await supabase.from("lesson").select("*");
  return lessons;
};

export default async function Home() {
  const supabase = supabaseServer();
  const lessons = await getAllLessons(supabase);

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
