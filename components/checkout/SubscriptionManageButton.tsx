"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SubscriptionManageButton = () => {
  const router = useRouter();

  const handleLoadPortal = async () => {
    const res = await fetch(`http://localhost:3000/api/portal`);
    const data = await res.json();

    router.push(data.url);
  };
  return (
    <Link href="/dashboard">
      <Button onClick={handleLoadPortal}>サブスクリプション管理する</Button>
    </Link>
  );
};

export default SubscriptionManageButton;
