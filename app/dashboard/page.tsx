import SubscriptionManageButton from "@/components/checkout/SubscriptionManageButton";
import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServer } from "../utils/supabaseServer";

const getProfileInfo = async (supabase: SupabaseClient<Database>) => {
  const { data: profile } = await supabase.from("profile").select("*").single();
  return profile;
};
const Dashboard = async () => {
  const supabase = supabaseServer();
  const profile = await getProfileInfo(supabase);
  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-8">
      <h1 className="text-xl mb-6">ユーザー管理ダッシュボード</h1>
      <div>
        <div className="my-4">
          {profile?.is_subscribed ? `契約中：${profile?.interval}` : "未契約"}
        </div>
        <SubscriptionManageButton />
      </div>
    </div>
  );
};

export default Dashboard;
