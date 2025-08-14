"use client";

import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MovieListPage({ title, category }) {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const ref = collection(db, "users", user.uid, category);
      const snap = await getDocs(ref);
      setMovies(snap.docs.map((doc) => doc.data()));
      setLoading(false);
    }
    fetchMovies();
  }, [user, category]);

  async function handleRemove(id) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, category, id.toString()));
    setMovies(movies.filter((m) => m.id !== id));
  }

  if (!user) {
    return <p className="p-4">Please log in to view your {title.toLowerCase()}.</p>;
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">{title}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-4xl mb-4">🍿</p>
            <h2 className="text-xl font-semibold">No movies here yet</h2>
            <p className="text-gray-500">Go add some from the Popular page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white p-2 rounded shadow hover:shadow-lg transition"
            >
              <Link href={`/movies/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded w-full"
                />
                <h2 className="mt-2 text-lg font-semibold text-gray-900 truncate">
                  {movie.title}
                </h2>
                <p className="text-gray-600">⭐ {movie.vote_average.toFixed(1)}</p>
              </Link>
              <button
                onClick={() => handleRemove(movie.id)}
                className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}