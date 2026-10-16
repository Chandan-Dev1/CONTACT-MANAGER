import { EditIcon, TrashIcon, MailIcon, PhoneIcon, BuildingIcon } from "./Icons.jsx";

// Poore class names likhe hain taaki Tailwind unhe detect kar sake
const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function colorFor(name = "") {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function ContactCard({ contact, onEdit, onDelete }) {
  const added = formatDate(contact.createdAt ?? contact.created_at);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60">
      <div className="flex items-start gap-3.5">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-bold ${colorFor(contact.name)}`}
          aria-hidden="true"
        >
          {initials(contact.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900" title={contact.name}>
            {contact.name}
          </h3>
          {contact.company ? (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">
              <BuildingIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{contact.company}</span>
            </p>
          ) : (
            <p className="mt-0.5 text-sm italic text-slate-400">No company</p>
          )}
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5">
          <MailIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <dt className="sr-only">Email</dt>
          <dd className="min-w-0 truncate">
            <a
              href={`mailto:${contact.email}`}
              className="text-slate-600 hover:text-indigo-600 hover:underline"
              title={contact.email}
            >
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2.5">
          <PhoneIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <dt className="sr-only">Phone</dt>
          <dd className="min-w-0 truncate">
            <a
              href={`tel:${contact.phone}`}
              className="text-slate-600 hover:text-indigo-600 hover:underline"
            >
              {contact.phone}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">{added ? `Added ${added}` : ""}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            aria-label={`Edit ${contact.name}`}
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${contact.name}`}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
