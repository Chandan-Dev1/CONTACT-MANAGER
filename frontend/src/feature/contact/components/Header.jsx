import { PlusIcon, UsersIcon } from "./Icons.jsx";

export default function Header({ total, onAdd }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
            <UsersIcon />
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              Contact Manager
            </h1>
            <p className="text-xs text-slate-500">
              {total === null
                ? "Loading…"
                : `${total} ${total === 1 ? "contact" : "contacts"}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-[0.97] sm:px-4"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Add Contact</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
