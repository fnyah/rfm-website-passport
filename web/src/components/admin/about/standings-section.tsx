"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "@/components/rich-text";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { StandingForm } from "@/components/admin/about/standing-form";
import { deleteStanding } from "@/lib/actions/about";
import type { StandingDoc } from "@/models/Standing";

type DialogState = { mode: "create" } | { mode: "edit"; standing: StandingDoc } | null;

export function StandingsSection({ standings }: { standings: StandingDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium">My Standings</h2>
          <p className="text-sm text-muted-foreground">
            Roles, honors, and affiliations listed on the About page.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {standings.map((standing) => (
          <Card key={standing._id}>
            <CardContent className="flex items-start justify-between gap-4">
              <RichText html={standing.information} className="min-w-0 text-sm" />
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit standing"
                  onClick={() => setDialog({ mode: "edit", standing })}
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDeleteButton
                  itemLabel="standing"
                  action={deleteStanding.bind(null, standing._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {standings.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No standings yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit standing" : "Add a standing"}
      >
        {dialog && (
          <StandingForm
            key={dialog.mode === "edit" ? dialog.standing._id : "new"}
            standing={dialog.mode === "edit" ? dialog.standing : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
