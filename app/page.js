"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import MainLayout from "./_components/layout";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchMovies(1, query, true);
  }, [query]);

  const fetchMovies = async (pageNumber, searchTerm = "", reset = false) => {
    setLoading(true);

    const endpoint = searchTerm
      ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchTerm)}&page=${pageNumber}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${pageNumber}`;

    const res = await fetch(endpoint);
    const data = await res.json();

    let updatedMovies;
    if (reset) {
      updatedMovies = data.results;
    } else {
      // Merge previous movies with new ones and remove duplicates
      const combined = [...movies, ...data.results];
      const map = new Map();
      combined.forEach((m) => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
      updatedMovies = Array.from(map.values());
    }

    setMovies(updatedMovies);
    setHasMore(data.page < data.total_pages);
    setLoading(false);
    setPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchMovies(1, "", true);
    fetchMovies(1, query, true);
  };

  // Infinite scroll intersection observer
  const loadMore = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchMovies(page + 1, query);
      }
    },
    [hasMore, loading, page, query]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(loadMore, { threshold: 1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <MainLayout>
      <div className="p-5">
        <div className="flex">
          <h1 className="text-5xl block ml-auto">Popular Movies</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 ml-auto">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/20 transition-all duration-300 ease-in-out w-50 focus:w-100 flex-1 px-4 py-2 border border-pink-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600"
            />
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded"
                />
                <h2
                  title={movie.title}
                  className="truncate mt-2 text-lg font-semibold text-gray-900"
                >
                  {movie.title}
                </h2>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Infinite scroll loader */}
        {loading && <p className="mt-4 text-center text-gray-500">Loading...</p>}
        <div ref={loaderRef} className="h-10"></div>
      </div>
    </MainLayout>
  );
}