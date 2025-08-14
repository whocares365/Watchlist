import MainLayout from "../_components/layout";
import MovieListPage from "../_components/MovieListPage";

export default function WatchedPage() {
  return(
    <main>
        <MainLayout>
            <MovieListPage title="✅ Watched" category="watched" />
        </MainLayout>
    </main>
); 
}