import { useEffect, useState } from "react";

const empty = { title: "", author: "", genre: "", status: "To read", rating: 0, notes: "" };

// Used for both Add and Edit. `book` = existing book when editing.
export default function BookForm({ book, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(book ? { ...empty, ...book } : empty);
  }, [book]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "rating" ? Number(value) : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await onSave(form);
    if (ok && !book) setForm(empty); // clear the form after adding
    setBusy(false);
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h3>{book ? "Edit book" : "Add a book"}</h3>
      <label>Title
        <input name="title" value={form.title} onChange={onChange} required />
      </label>
      <label>Author
        <input name="author" value={form.author} onChange={onChange} required />
      </label>
      <div className="row">
        <label>Genre
          <input name="genre" value={form.genre} onChange={onChange} placeholder="e.g. Sci-fi" />
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={onChange}>
            <option>To read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>
        </label>
      </div>
      <label>Rating
        <select name="rating" value={form.rating} onChange={onChange}>
          <option value={0}>Not rated</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} / 5</option>
          ))}
        </select>
      </label>
      <label>Notes
        <textarea name="notes" rows={3} value={form.notes} onChange={onChange} />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : book ? "Save changes" : "Add book"}
        </button>
        {book && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
