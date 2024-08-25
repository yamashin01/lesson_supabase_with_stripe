import Link from "next/link";
import React from "react";
import AuthServerButton from "./auth/AuthServerButton";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="flex border-b py-4 px-6 border-gray-200">
      <Link href={"/"}>
        <Button variant="outline">ホーム</Button>
      </Link>
      <Link href={"/pricing"} className="ml-4">
        <Button variant="outline">価格</Button>
      </Link>
      <div className="ml-auto">
        <AuthServerButton />
      </div>
    </div>
  );
};

export default Header;
