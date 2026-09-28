"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ObfuscatedEmailAnchorProps = {
  className?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  icon?: ReactNode;
};

export default function ObfuscatedEmailAnchor({
  className,
  fallbackHref = "/contact-us",
  fallbackLabel = "Email us",
  icon,
}: ObfuscatedEmailAnchorProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const user = "info";
    const domain = "beipoready.com";
    const email = `${user}@${domain}`;
    const linkNode = linkRef.current;
    const labelNode = labelRef.current;

    if (linkNode) {
      linkNode.href = `mailto:${email}`;
    }

    if (labelNode) {
      labelNode.textContent = email;
    }
  }, []);

  return (
    <a ref={linkRef} href={fallbackHref} className={className}>
      {icon}
      <span ref={labelRef}>{fallbackLabel}</span>
    </a>
  );
}
