"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

/** Shared guard for account and listing forms; never stores sensitive data. */
export function UnsavedChanges({ dirty }: { dirty: boolean }) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        (url.pathname === location.pathname && url.search === location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setDestination(url.pathname + url.search + url.hash);
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty]);
  return (
    <Dialog
      open={!!destination}
      onClose={() => setDestination("")}
      aria-labelledby="unsaved-title"
    >
      <DialogTitle id="unsaved-title">Leave without saving?</DialogTitle>
      <DialogContent>
        <p>
          You have unsaved changes. Save your work before leaving, or discard
          the changes.
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setDestination("")}>
          Keep editing
        </Button>
        <Button
          color="warning"
          onClick={() => {
            const href = destination;
            setDestination("");
            router.push(href);
          }}
        >
          Discard changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
