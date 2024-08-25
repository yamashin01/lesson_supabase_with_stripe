"use client";

import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const AuthClientButton = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <>
      {session ? (
        <Button onClick={handleSignOut}>サインアウト</Button>
      ) : (
        <Button onClick={handleSignIn}>サインイン</Button>
      )}
    </>
  );
};

export default AuthClientButton;
