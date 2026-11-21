"use client";

import { useEffect } from "react";
import { CircleCheck } from "lucide-react";

/**
 * The green "it worked" message shown at the top of a list after a save or a
 * delete (the server actions redirect here with ?saved=1 or ?deleted=1). The
 * query is then dropped from the address bar so a refresh doesn't repeat it.
 */
export function StatusBanner({
  saved,
  deleted,
}: {
  saved?: boolean;
  deleted?: boolean;
}) {
  useEffect(() => {
    if (saved || deleted) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [saved, deleted]);

  if (!saved && !deleted) return null;

  return (
    <div
      role="status"
      className="mb-8 flex items-start gap-3 rounded-xl border-2 border-emerald-700 bg-emerald-50 px-5 py-4 text-lg text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-50"
    >
      <CircleCheck className="mt-0.5 size-6 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
      <p>
        <strong className="font-semibold">{saved ? "Saved." : "Deleted."}</strong>{" "}
        {saved
          ? "Your website now shows the change."
          : "It has been removed from your website."}
      </p>
    </div>
  );
}
