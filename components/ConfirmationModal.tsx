"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Dialog open onOpenChange={() => onCancel()}>
      <DialogContent className="bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
