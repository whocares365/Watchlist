"use client";

import { db, auth } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import MainLayout from "@/app/_components/layout";

export default function MovieDetail() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // status flags for this movie in user's collections
  const [statuses, setStatuses] = useState({
    favorites: false,
    watched: false,
    watchLater: false,
  });

  // busy flags for each button to prevent double clicks
  const [busy, setBusy] = useState({
    favorites: false,
    watched: false,
    watchLater: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // if user logs out, reset statuses
      if (!currentUser) {
        setStatuses({ favorites: false, watched: false, watchLater: false });
      }
    });
    return () => unsub();
  }, []);

  // Fetch movie data from TMDb
  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMovie();
  }, [id]);

  // When user and movie are available, check if movie is in user's lists
  useEffect(() => {
    if (!user || !movie) return;

    let cancelled = false;

    async function checkStatuses() {
      try {
        const cats = ["favorites", "watched", "watchLater"];
        const newStatuses = {};
        for (const cat of cats) {
          const ref = doc(db, "users", user.uid, cat, String(movie.id));
          const snap = await getDoc(ref);
          newStatuses[cat] = snap.exists();
        }
        if (!cancelled) setStatuses(newStatuses);
      } catch (err) {
        console.error("Error checking statuses:", err);
      }
    }

    checkStatuses();
    return () => {
      cancelled = true;
    };
  }, [user, movie]);

  // toggle add/remove for given category
  async function toggleCategory(cat) {
    if (!user) return toast.error("Please sign in first.");
    if (!movie) return toast.error("Movie data not loaded yet.");

    setBusy((s) => ({ ...s, [cat]: true }));
    const ref = doc(db, "users", user.uid, cat, String(movie.id));

    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        // remove
        await deleteDoc(ref);
        setStatuses((s) => ({ ...s, [cat]: false }));
        toast.success(`Removed from ${readableName(cat)}`);
      } else {
        // add
        await setDoc(ref, {
          id: movie.id,
          title: movie.title || "",
          poster_path: movie.poster_path || "",
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || "",
        });
        setStatuses((s) => ({ ...s, [cat]: true }));
        toast.success(`Added to ${readableName(cat)}`);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Operation failed. Try again.");
    } finally {
      setBusy((s) => ({ ...s, [cat]: false }));
    }
  }

  function readableName(cat) {
    if (cat === "favorites") return "Favorites";
    if (cat === "watchLater") return "Watch Later";
    if (cat === "watched") return "Watched";
    return cat;
  }

  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading movie details...</p>;
  }

  if (!movie) {
    return <p className="p-4 text-center text-red-500">Movie not found.</p>;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Poster */}
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg max-w-xs mx-auto md:mx-0 shadow-md"
          />
        )}

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{movie.title}</h1>

          <p className="text-gray-600 mb-4">{movie.overview}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <span className="px-3 py-1 bg-yellow-400 rounded text-black font-semibold inline-block">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-blue-500 rounded text-white font-semibold inline-block">
              🎬 {movie.release_date}
            </span>
            <span className="px-3 py-1 bg-green-500 rounded text-white font-semibold inline-block">
              🕒 {movie.runtime} mins
            </span>
          </div>

          <div className="mt-auto flex flex-wrap gap-4">
            {/* Favorites */}
            <button
              onClick={() => toggleCategory("favorites")}
              disabled={busy.favorites}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
                statuses.favorites
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              } disabled:opacity-60`}
            >
              {statuses.favorites ? "✓ In Favorites" : "⭐ Add to Favorites"}
            </button>

            {/* Watched */}
            <button
              onClick={() => toggleCategory("watched")}
              disabled={busy.watched}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
                statuses.watched
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "bg-green-600 text-white hover:bg-green-700"
              } disabled:opacity-60`}
            >
              {statuses.watched ? "✅ In Watched" : "✅ Mark as Watched"}
            </button>

            {/* Watch Later */}
            <button
              onClick={() => toggleCategory("watchLater")}
              disabled={busy.watchLater}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
                statuses.watchLater
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } disabled:opacity-60`}
            >
              {statuses.watchLater ? "🕓 Saved" : "🕓 Watch Later"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 