import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ContactList from "../components/ContactList.jsx";
import ContactForm from "../components/ContactForm.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import { AlertIcon, CheckIcon, XIcon } from "../components/Icons.jsx";
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  getErrorMessage,
} from "../service/contact.api.js";

const getId = (c) => c._id ?? c.id;

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(null); // header ke count ke liye (search ke bina)
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const abortRef = useRef(null);

  /* ---------- toast ---------- */
  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- search debounce (typing ke 350ms baad hi API call) ---------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  /* ---------- contacts load ---------- */
  const loadContacts = useCallback(async (q) => {
    abortRef.current?.abort(); // purani request cancel => race condition nahi
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const data = await fetchContacts(q, controller.signal);
      if (controller.signal.aborted) return;
      setContacts(data);
      if (!q.trim()) setTotal(data.length);
    } catch (err) {
      if (err?.code === "ERR_CANCELED" || controller.signal.aborted) return;
      setError(getErrorMessage(err, "Failed to load contacts."));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts(debouncedQuery);
    return () => abortRef.current?.abort();
  }, [debouncedQuery, loadContacts]);

  // Search ke dauran header ka total sahi rakhne ke liye, pehli baar total alag se laate hain
  useEffect(() => {
    if (debouncedQuery.trim() && total === null) {
      fetchContacts("")
        .then((all) => setTotal(all.length))
        .catch(() => {});
    }
  }, [debouncedQuery, total]);

  /* ---------- form handlers ---------- */
  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (contact) => {
    setEditing(contact);
    setFormOpen(true);
  };
  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);

  // Error throw hone par ContactForm khula rehta hai. UI sirf API success ke baad update hota hai.
  const handleSubmit = async (payload) => {
    if (editing) {
      await updateContact(getId(editing), payload);
      showToast("Contact updated successfully");
    } else {
      await createContact(payload);
      showToast("Contact added successfully");
    }
    closeForm();
    await loadContacts(debouncedQuery);
    if (!debouncedQuery.trim()) return;
    fetchContacts("")
      .then((all) => setTotal(all.length))
      .catch(() => {});
  };

  /* ---------- delete handlers ---------- */
  const askDelete = (contact) => {
    setDeleteError("");
    setDeleting(contact);
  };
  const cancelDelete = useCallback(() => {
    setDeleting(null);
    setDeleteError("");
  }, []);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await deleteContact(getId(deleting));
      const id = getId(deleting);
      // API success ke baad hi list se hatao
      setContacts((prev) => prev.filter((c) => getId(c) !== id));
      setTotal((t) => (t === null ? t : Math.max(0, t - 1)));
      setDeleting(null);
      showToast("Contact deleted");
    } catch (err) {
      if (err?.response?.status === 404) {
        // Pehle hi delete ho chuka hai - list refresh kar do
        setDeleting(null);
        showToast("That contact no longer exists", "error");
        loadContacts(debouncedQuery);
      } else {
        setDeleteError(getErrorMessage(err, "Failed to delete contact."));
      }
    } finally {
      setDeleteBusy(false);
    }
  };

  const isSearching = query !== debouncedQuery || (loading && debouncedQuery.trim() !== "");

  return (
    <div className="min-h-dvh">
      <Header total={total} onAdd={openAdd} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-6 sm:mb-8">
          <SearchBar value={query} onChange={setQuery} searching={isSearching} />
          {debouncedQuery.trim() && !loading && !error && (
            <p className="mt-3 px-1 text-sm text-slate-500" aria-live="polite">
              {contacts.length} {contacts.length === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-slate-700">“{debouncedQuery.trim()}”</span>
            </p>
          )}
        </div>

        <ContactList
          contacts={contacts}
          loading={loading}
          error={error}
          query={debouncedQuery}
          onRetry={() => loadContacts(debouncedQuery)}
          onAdd={openAdd}
          onClearSearch={() => setQuery("")}
          onEdit={openEdit}
          onDelete={askDelete}
        />
      </main>

      {formOpen && (
        <ContactForm
          key={editing ? getId(editing) : "new"}
          contact={editing}
          onSubmit={handleSubmit}
          onClose={closeForm}
          getErrorMessage={getErrorMessage}
        />
      )}

      {deleting && (
        <DeleteModal
          contact={deleting}
          busy={deleteBusy}
          error={deleteError}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4">
          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-xl animate-toast ${
              toast.type === "error" ? "bg-rose-600" : "bg-slate-900"
            }`}
          >
            {toast.type === "error" ? (
              <AlertIcon className="h-5 w-5 shrink-0" />
            ) : (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="ml-1 text-white/70 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
