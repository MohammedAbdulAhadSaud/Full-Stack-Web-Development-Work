import { useCallback, useEffect, useState } from "react";
import api from "../api";
import BookForm from "../components/BookForm.jsx";

const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

export default function Books() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // READ
  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/books", { params: { search, status } });
      setBooks(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load books.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const id = setTimeout(load, 250); // small debounce for search typing
    return () => clearTimeout(id);
  }, [load]);

  // CREATE or UPDATE (returns true when successful)
  const save = async (form) => {
    try {
      if (editing) {
        await api.put(`/books/${editing._id}`, form);
        setEditing(null);
      } else {
        await api.post("/books", form);
      }
      await load();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the book.");
      return false;
    }
  };

  // DELETE
  const remove = async (book) => {
    if (!window.confirm(`Delete “${book.title}”?`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      if (editing && editing._id === book._id) setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the book.");
    }
  };

  const counts = {
    total: books.length,
    reading: books.filter((b) => b.status === "Reading").length,
    finished: books.filter((b) => b.status === "Finished").length,
  };

  return (
    <div className="books-layout">
      <aside>
        <BookForm book={editing} onSave={save} onCancel={() => setEditing(null)} />
      </aside>

      <section>
        <div className="summary">
          <span><b>{counts.total}</b> shown</span>
          <span><b>{counts.reading}</b> reading</span>
          <span><b>{counts.finished}</b> finished</span>
        </div>

        <div className="toolbar">
          <input
            type="search"
            placeholder="Search title, author or genre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search books"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            <option>To read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>
        </div>

        {error && <div className="alert">{error}</div>}
        {loading && <p className="muted">Loading your books…</p>}

        {!loading && books.length === 0 && (
          <div className="empty">
            <h3>Your shelf is empty</h3>
            <p className="muted">Add your first book using the form to get started.</p>
          </div>
        )}

        <div className="grid">
          {books.map((b) => (
            <article key={b._id} className={`card ${b.status.replace(" ", "-").toLowerCase()}`}>
              <div className="card-top">
                <span className="badge">{b.status}</span>
                <span className="stars" aria-label={`Rated ${b.rating} out of 5`}>{stars(b.rating)}</span>
              </div>
              <h3>{b.title}</h3>
              <p className="author">by {b.author}</p>
              <p className="muted">{b.genre}</p>
              {b.notes && <p className="notes">{b.notes}</p>}
              <div className="card-actions">
                <button className="btn btn-small" onClick={() => { setEditing(b); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => remove(b)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
