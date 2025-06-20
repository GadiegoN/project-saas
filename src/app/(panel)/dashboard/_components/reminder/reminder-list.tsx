"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@/generated/prisma";
import { Plus, Trash2 } from "lucide-react";
import { deleteReminder } from "../../_actions/delete-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderContent } from "./reminder-content";
import { useState } from "react";

interface ReminderListProps {
  reminder: Reminder[];
}

export function ReminderList({ reminder }: ReminderListProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handleDeleteReminder(id: string) {
    const response = await deleteReminder({ reminderId: id });

    if (response.error) {
      toast.error(response.error);

      return;
    }

    toast.success(response.data);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="">
          <div className="flex items-center justify-between py-4">
            <CardTitle className="text-xl lg:text-2xl">Lembretes</CardTitle>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Plus />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-[495px]">
                <DialogHeader>
                  <DialogTitle>Novo lembrete</DialogTitle>
                  <DialogDescription>
                    Criar um novo lembrete para sua lista.
                  </DialogDescription>
                </DialogHeader>

                <ReminderContent closeDialog={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {reminder.length === 0 && (
            <article className="flex flex-wrap w-11/12 mx-auto flex-row items-center justify-center py-4 bg-muted mb-2 px-2 rounded-md">
              <p className="font-semibold">Nenhum lembrete registrado...</p>
            </article>
          )}

          {reminder.length > 0 && (
            <ScrollArea className="h-[340px] lg:max-h-[calc(100vh - 15rem)] pr-0 w-hull flex-1">
              {reminder.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap flex-row w-11/12 mx-auto items-center justify-between py-2 bg-muted mb-2 px-2 rounded-md"
                >
                  <p>{item.description}</p>

                  <Button
                    onClick={() => handleDeleteReminder(item.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 />
                  </Button>
                </article>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
