import Footer from "../_components/footer";
import Header from "../_components/header";
import MainLayout from "../_components/layout";
import MovieListPage from "../_components/MovieListPage";

export default function WatchLaterPage() {
  return (
    <main>
        <MainLayout>
        <MovieListPage title="🕓 Watch Later" category="watchLater" />
        </MainLayout>
    </main>
  );
}