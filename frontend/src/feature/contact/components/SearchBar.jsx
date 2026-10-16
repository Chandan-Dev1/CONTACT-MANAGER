import { SearchIcon, XIcon, Spinner } from "./Icons.jsx";

export default function SearchBar({ value, onChange, searching }) {
  return (
    <div className="relative">
      <label htmlFor="contact-search" className="sr-only">
        Search contacts
      </label>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        id="contact-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email or phone…"
        autoComplete="off"
        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
        {searching ? (
          <Spinner className="h-5 w-5 text-indigo-500" />
        ) : (
          value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
