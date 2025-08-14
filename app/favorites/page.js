import MainLayout from "../_components/layout";
import MovieListPage from "../_components/MovieListPage";

export default function FavoritesPage() {
  return (
    <main>
      <MainLayout>
        <MovieListPage title="⭐ Favorites" category="favorites" />
      </MainLayout>
    </main>
);
}