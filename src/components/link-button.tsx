"use client";
import MuiButton, { type ButtonProps } from "@mui/material/Button";
import Link from "next/link";
/** Navigation renders an anchor; action buttons remain buttons. */
export function LinkButton({
  href,
  ...props
}: Omit<ButtonProps<"a">, "href" | "component"> & { href: string }) {
  return <MuiButton component={Link} href={href} {...props} />;
}
