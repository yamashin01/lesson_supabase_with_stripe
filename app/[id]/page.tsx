import { createServerComponentClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import React from "react";
import { cookies } from "@/node_modules/next/headers";
import { Database } from "@/lib/database.types";

const supabase = createServerComponentClient<Database>({ cookies });

const getDetailLesson = async (id: number) => {
  const { data: lessons } = await supabase
    .from("lesson")
    .select("*")
    .eq("id", id)
    .single();
  return lessons;
};

const LessonDetailPage = async ({ params }: { params: { id: number } }) => {
  const lesson = await getDetailLesson(params.id);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson?.title}</h1>
      <p className="mb-8">{lesson?.description}</p>
    </div>
  );
};

export default LessonDetailPage;
