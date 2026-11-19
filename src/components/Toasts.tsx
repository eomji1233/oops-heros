import type { Toast } from "../game/store.ts";

export function Toasts({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
