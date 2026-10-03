import { cn } from "@/lib/utils";

export function PixLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5 text-[#32bcad]", className)} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5 7.6 6.9h1.1c.8 0 1.5.3 2 .8L12 9l1.3-1.3c.5-.5 1.2-.8 2-.8h1.1L12 2.5Zm-6.1 6L2.5 12l3.4 3.4h2.2c.4 0 .8-.2 1.1-.5L11 13.1a1.6 1.6 0 0 0-2.2-2.2L7.1 9c-.3-.3-.7-.5-1.1-.5Zm12.2 0h-2.2c-.4 0-.8.2-1.1.5l-1.8 1.8a1.6 1.6 0 0 0 2.2 2.2l1.8 1.8c.3.3.7.5 1.1.5h.1l3.4-3.4-3.5-3.4ZM12 15l-1.3 1.3c-.5.5-1.2.8-2 .8H7.6l4.4 4.4 4.4-4.4h-1.1c-.8 0-1.5-.3-2-.8L12 15Z" />
    </svg>
  );
}
