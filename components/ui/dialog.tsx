import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children, footer }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
            {description && <p className="text-sm text-slate-500 mt-1.5">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-6 pt-0 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}