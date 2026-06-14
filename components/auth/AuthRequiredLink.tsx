"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/components/auth/AuthProvider";

type AuthRequiredLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
};

export function AuthRequiredLink({
  href,
  onClick,
  ...props
}: AuthRequiredLinkProps) {
  const { status } = useSession();
  const { openAuthModal } = useAuthModal();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || status === "authenticated") {
      return;
    }

    event.preventDefault();
    openAuthModal();
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
