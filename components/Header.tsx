import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import React from "react";
import AuthServerButton from "./auth/AuthServerButton";
import { Button } from "./ui/button";
import { cookies } from "next/headers";

const Header = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: user } = await supabase.auth.getSession();

  const authServerButton = await AuthServerButton();

  return (
    <div className="flex border-b py-4 px-6 border-gray-200">
      <Link href={"/"}>
        <Button variant="outline">ホーム</Button>
      </Link>
      {user.session && (
        <Link href={"/dashboard"} className="ml-4">
          <Button variant="outline">ダッシュボード</Button>
        </Link>
      )}
      <Link href={"/pricing"} className="ml-4">
        <Button variant="outline">価格</Button>
      </Link>
      <div className="ml-auto">{authServerButton}</div>
    </div>
  );
};

export default Header;
