import { useEffect } from "react";
import { TrashIcon, Spinner } from "./Icons.jsx";

export default function DeleteModal({ contact, busy, error, onCancel, onConfirm }) {
  // Escape se band karo (delete chal raha ho tab nahi)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-pop sm:p-7"
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <TrashIcon className="h-7 w-7" />
        </div>
        <h2 id="delete-title" className="mt-5 text-xl font-bold text-slate-900">
          Delete this contact?
        </h2>
        <p id="delete-desc" className="mt-2 text-sm leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-700">{contact.name}</span> will be permanently
          removed. This action cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-70"
          >
            {busy ? <Spinner className="h-4 w-4" /> : <TrashIcon className="h-4 w-4" />}
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
