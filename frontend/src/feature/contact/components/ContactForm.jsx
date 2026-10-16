import { useEffect, useRef, useState } from "react";
import { XIcon, Spinner } from "./Icons.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d{7,15}$/;

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.replace(/[\s\-().]/g, "");
  const company = values.company.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 80) errors.name = "Name must be 80 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email, e.g. asha@example.com.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone))
    errors.phone = "Enter 7–15 digits. A leading + is allowed (spaces and dashes are fine).";

  if (company.length > 80) errors.company = "Company must be 80 characters or fewer.";

  return errors;
}

function Field({ id, label, optional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-slate-400">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100"
  }`;

/**
 * contact === null  -> Add mode
 * contact === {...} -> Edit mode
 * onSubmit(payload) ek Promise hona chahiye; error throw hone par form khula rehta hai.
 */
export default function ContactForm({ contact, onSubmit, onClose, getErrorMessage }) {
  const isEdit = Boolean(contact);
  const [values, setValues] = useState({
    name: contact?.name ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    company: contact?.company ?? "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [saving, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    setServerError("");
    // Jis field ko user chhu chuka hai, usse live validate karo
    if (touched[name] || errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, phone: true, company: true });
    if (Object.keys(found).length > 0) {
      const firstKey = ["name", "email", "phone", "company"].find((k) => found[k]);
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    setSaving(true);
    setServerError("");
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        company: values.company.trim(),
      });
      // Success par parent modal band kar deta hai
    } catch (err) {
      const message = getErrorMessage(err, "Could not save the contact.");
      if (/email/i.test(message)) setErrors((prev) => ({ ...prev, email: message }));
      else setServerError(message);
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-fade sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="flex max-h-[95dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl animate-pop sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="form-title" className="text-xl font-bold text-slate-900">
              {isEdit ? "Edit contact" : "Add new contact"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit ? "Update the details below." : "Fill in the details to save a contact."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto px-6 py-6">
            {serverError && (
              <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {serverError}
              </p>
            )}

            <Field id="field-name" label="Full name" error={errors.name}>
              <input
                ref={nameRef}
                id="field-name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Asha Shah"
                autoComplete="off"
                maxLength={80}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "field-name-error" : undefined}
                className={inputClass(errors.name)}
              />
            </Field>

            <Field id="field-email" label="Email" error={errors.email}>
              <input
                id="field-email"
                name="email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="asha@example.com"
                autoComplete="off"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "field-email-error" : undefined}
                className={inputClass(errors.email)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="field-phone" label="Phone" error={errors.phone}>
                <input
                  id="field-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="9876543210"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "field-phone-error" : undefined}
                  className={inputClass(errors.phone)}
                />
              </Field>

              <Field id="field-company" label="Company" optional error={errors.company}>
                <input
                  id="field-company"
                  name="company"
                  type="text"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ABC Pvt Ltd"
                  autoComplete="off"
                  maxLength={80}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "field-company-error" : undefined}
                  className={inputClass(errors.company)}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end sm:rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {saving && <Spinner className="h-4 w-4" />}
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
