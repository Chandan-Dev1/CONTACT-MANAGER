import ContactCard from "./ContactCard.jsx";
import { AlertIcon, PlusIcon, RefreshIcon, SearchIcon, UsersIcon } from "./Icons.jsx";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="mt-5 h-9 rounded-lg bg-slate-100" />
    </div>
  );
}

function StateBox({ icon, title, text, children, tone = "slate" }) {
  const tones = {
    slate: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
      <div>
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${tones[tone]}`}>
          {icon}
        </div>
        <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">{text}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

const primaryBtn =
  "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.97]";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.97]";

export default function ContactList({
  contacts,
  loading,
  error,
  query,
  onRetry,
  onAdd,
  onClearSearch,
  onEdit,
  onDelete,
}) {
  // Pehli baar load ho raha hai
  if (loading && contacts.length === 0 && !error) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading contacts">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error aur kuch dikhane ko nahi
  if (error && contacts.length === 0) {
    return (
      <StateBox tone="rose" icon={<AlertIcon className="h-8 w-8" />} title="Couldn't load contacts" text={error}>
        <button type="button" onClick={onRetry} className={primaryBtn}>
          <RefreshIcon className="h-4 w-4" />
          Try again
        </button>
      </StateBox>
    );
  }

  // Koi result nahi
  if (!loading && contacts.length === 0) {
    if (query.trim()) {
      return (
        <StateBox
          icon={<SearchIcon className="h-8 w-8" />}
          title="No matching contacts"
          text={`Nothing found for “${query.trim()}”. Try a different name, email or phone number.`}
        >
          <button type="button" onClick={onClearSearch} className={ghostBtn}>
            Clear search
          </button>
        </StateBox>
      );
    }
    return (
      <StateBox
        icon={<UsersIcon className="h-8 w-8" />}
        title="No contacts yet"
        text="Your address book is empty. Add your first contact to get started."
      >
        <button type="button" onClick={onAdd} className={primaryBtn}>
          <PlusIcon className="h-4 w-4" />
          Add your first contact
        </button>
      </StateBox>
    );
  }

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <span>{error}</span>
          <button type="button" onClick={onRetry} className="font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <li key={contact._id ?? contact.id} className="animate-fade">
            <ContactCard contact={contact} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}
