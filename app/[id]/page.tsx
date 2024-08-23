import { createServerComponentClient } from "@/node_modules/@supabase/auth-helpers-nextjs/dist/index";
import React from "react";
import { cookies } from "@/node_modules/next/headers";

const supabase = createServerComponentClient({ cookies });
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
  console.log(lesson);
  return <div>LessonDetailPage</div>;
};

export default LessonDetailPage;
