import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const spines = [
  { t: "Dune", c: "#0f5c5c", h: 210 },
  { t: "Sapiens", c: "#e0a526", h: 250 },
  { t: "Atomic Habits", c: "#2b3a67", h: 190 },
  { t: "The Alchemist", c: "#b5483a", h: 235 },
  { t: "Wings of Fire", c: "#4a7c59", h: 205 },
  { t: "Deep Work", c: "#1d1d2c", h: 245 },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Know what you’re reading, what’s next, and what you finished.</h1>
        <p className="lead">
          Shelfwise keeps your personal book list in one place. Add a book, track
          your progress, rate it when you’re done.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/books" className="btn btn-primary btn-lg">Open my books</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Create free account</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">I already have one</Link>
            </>
          )}
        </div>
      </div>

      <div className="shelf" aria-hidden="true">
        <div className="spines">
          {spines.map((s) => (
            <div key={s.t} className="spine" style={{ background: s.c, height: s.h }}>
              <span>{s.t}</span>
            </div>
          ))}
        </div>
        <div className="plank" />
      </div>
    </section>
  );
}
