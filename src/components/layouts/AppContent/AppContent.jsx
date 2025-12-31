import { Layout, Card, Flex, Spin } from "antd";
import { useState, useEffect } from "react";
import SearchBar from "../../common/SearchBar/SearchBar";
import { movieSearch, getMovieDetails } from "../../../services/movieApi";
import Modal from "../../common/Modal/Modal";
import "./AppContent.css";

const { Content } = Layout;

const contentStyle = {
  textAlign: "center",
  minHeight: "100vh",
  color: "#e5e5e5",
  background: "#0a0a0a",
  padding: "2rem",
  paddingTop: "1rem",
};

export default function AppContent() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const detaliesCard = async (movie) => {
    const details = await getMovieDetails(movie.imdbID);
    setSelectedMovie(details);
    setModalOpen(true);
    console.log(details);
  };

  const apiSearchMovies = async (query) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await movieSearch(query, 1);

      if (result.Response === "True") {
        setMovies(result.Search || []);
      } else {
        setMovies([]);
        setError(result.Error || "Фильмы не найдены");
      }
    } catch (err) {
      setError("Ошибка при поиске фильмов", err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchSection = document.getElementById("search-section");
    if (searchSection) {
      setTimeout(() => {
        searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const topMovieIds = [
    "tt0111161", // Побег из Шоушенка (9.3)
    "tt0068646", // Крестный отец (9.2)
    "tt0468569", // Темный рыцарь (9.0)
    "tt0071562", // Крестный отец 2 (9.0)
    "tt0050083", // 12 разгневанных мужчин (9.0)
    "tt0108052", // Список Шиндлера (8.9)
    "tt0167260", // Властелин колец: Возвращение короля (8.9)
    "tt0110912", // Криминальное чтиво (8.9)
    "tt0060196", // Хороший, плохой, злой (8.8)
    "tt0137523", // Бойцовский клуб (8.8)
  ];
  const loadTopMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const promises = topMovieIds.map((id) => getMovieDetails(id));
      const results = await Promise.all(promises);

      const successfulResults = results.filter(
        (movie) => movie.Response === "True"
      );

      const sortedMovies = successfulResults.sort((a, b) => {
        const ratingA = parseFloat(a.imdbRating) || 0;
        const ratingB = parseFloat(b.imdbRating) || 0;
        return ratingB - ratingA;
      });

      setMovies(sortedMovies.slice(0, 10));
    } catch (error) {
      setError("Ошибка при загрузке топ фильмов");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopMovies();
  }, []);

  function systemSearch(event) {
    event.preventDefault();
    apiSearchMovies(searchValue);
  }

  return (
    <Content style={contentStyle} className="app-content" id="main-content">
      <div id="search-section" style={{ scrollMarginTop: "100px" }}>
        <SearchBar
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          submitSearch={systemSearch}
        />
      </div>

      <div className="movies-container">
        {!isLoading &&
          !error &&
          movies.map((movie) => (
            <Card
              key={movie.imdbID}
              className="movie-card"
              style={{ width: "100%" }}
              onClick={() => detaliesCard(movie)}
            >
              {movie.Poster && movie.Poster !== "N/A" ? (
                <>
                  <div className="movie-poster-wrapper">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="movie-poster"
                    />
                    <div className="movie-poster-overlay"></div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-year">{movie.Year}</p>
                  </div>
                </>
              ) : (
                <div
                  className="movie-info"
                  style={{ position: "relative", padding: "2rem" }}
                >
                  <h3 className="movie-title">{movie.Title}</h3>
                  <p className="movie-year">{movie.Year}</p>
                </div>
              )}
            </Card>
          ))}
      </div>

      {error === "Movie not found!" && (
        <div className="error-state">Фильм не найден!</div>
      )}

      {error === "Too many results." && (
        <div className="error-state">
          Слишком общий запрос. <br /> Укажите год или жанр фильма.
        </div>
      )}

      {isLoading && (
        <Flex
          align="center"
          justify="center"
          gap="middle"
          style={{ marginTop: "5rem" }}
        >
          <Spin size="large" />
        </Flex>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedMovie && (
          <div className="movie-details">
            <button
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            {selectedMovie.Poster && selectedMovie.Poster !== "N/A" && (
              <div className="movie-details-poster">
                <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
              </div>
            )}

            <div className="movie-details-content">
              <h2 className="movie-details-title">{selectedMovie.Title}</h2>

              <div className="movie-details-meta">
                {selectedMovie.Year && (
                  <span className="movie-details-badge">
                    <img
                      src="/icons/calendar.svg"
                      className="badge-icon"
                    />
                    {selectedMovie.Year}
                  </span>
                )}
                {selectedMovie.Type && (
                  <span className="movie-details-badge">
                    <img
                      src="/icons/clapperboard.svg"
                      className="badge-icon"
                    />
                    {selectedMovie.Type}
                  </span>
                )}
                {selectedMovie.Rated && selectedMovie.Rated !== "N/A" && (
                  <span className="movie-details-badge rated-badge">
                    <img
                      src="/icons/eye.svg"
                      className="badge-icon"
                    />
                    {selectedMovie.Rated}
                  </span>
                )}
                {selectedMovie.Runtime && selectedMovie.Runtime !== "N/A" && (
                  <span className="movie-details-badge">
                    <img
                      src="/icons/hourglass.svg"
                      className="badge-icon"
                    />
                    {selectedMovie.Runtime}
                  </span>
                )}
              </div>

              <div className="movie-details-ratings">
                {selectedMovie.imdbRating &&
                  selectedMovie.imdbRating !== "N/A" && (
                    <div className="rating-card imdb-rating">
                      <div className="rating-header">
                        <img
                          src="/icons/star.svg"
                          className="badge-icon"
                        />
                        <span className="rating-label">рейтинг</span>
                      </div>
                      <div className="rating-value-large">
                        {selectedMovie.imdbRating}
                      </div>
                      {selectedMovie.imdbVotes &&
                        selectedMovie.imdbVotes !== "N/A" && (
                          <div className="rating-votes">
                            {selectedMovie.imdbVotes} голосов
                          </div>
                        )}
                    </div>
                  )}
                {selectedMovie.Metascore &&
                  selectedMovie.Metascore !== "N/A" && (
                    <div className="rating-card metascore-rating">
                      <div className="rating-header">
                        <img
                          src="/icons/target.svg"
                          className="badge-icon"
                        />
                        <span className="rating-label">Мета-рейтинг</span>
                      </div>
                      <div className="rating-value-large">
                        {selectedMovie.Metascore}
                      </div>
                    </div>
                  )}
              </div>

              {selectedMovie.Plot && selectedMovie.Plot !== "N/A" && (
                <div className="movie-details-section">
                  <h3 className="section-title">
                    <img
                      src="/icons/notebook-pen.svg"
                      className="badge-icon"
                    />
                    Описание
                  </h3>
                  <p className="section-content">{selectedMovie.Plot}</p>
                </div>
              )}

              <div className="movie-details-grid">
                {selectedMovie.Genre && selectedMovie.Genre !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/drama.svg"
                        className="badge-icon"
                      />
                      Жанр
                    </h3>
                    <p className="section-content">{selectedMovie.Genre}</p>
                  </div>
                )}

                {selectedMovie.Director && selectedMovie.Director !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/clapperboard.svg"
                        className="badge-icon"
                      />
                      Режиссер
                    </h3>
                    <p className="section-content">{selectedMovie.Director}</p>
                  </div>
                )}

                {selectedMovie.Writer && selectedMovie.Writer !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/pencil.svg"
                        className="badge-icon"
                      />
                      Сценарист
                    </h3>
                    <p className="section-content">{selectedMovie.Writer}</p>
                  </div>
                )}

                {selectedMovie.Actors && selectedMovie.Actors !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/users.svg"
                        className="badge-icon"
                      />
                      Актеры
                    </h3>
                    <p className="section-content">{selectedMovie.Actors}</p>
                  </div>
                )}
              </div>

              <div className="movie-details-grid">
                {selectedMovie.Country && selectedMovie.Country !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/earth.svg"
                        className="badge-icon"
                      />
                      Страна
                    </h3>
                    <p className="section-content">{selectedMovie.Country}</p>
                  </div>
                )}

                {selectedMovie.Language && selectedMovie.Language !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/languages.svg"
                        className="badge-icon"
                      />
                      Язык
                    </h3>
                    <p className="section-content">{selectedMovie.Language}</p>
                  </div>
                )}

                {selectedMovie.Released && selectedMovie.Released !== "N/A" && (
                  <div className="movie-details-section">
                    <h3 className="section-title">
                      <img
                        src="/icons/calendar.svg"
                        className="badge-icon"
                      />
                      Дата выхода
                    </h3>
                    <p className="section-content">{selectedMovie.Released}</p>
                  </div>
                )}
              </div>

              {selectedMovie.Awards && selectedMovie.Awards !== "N/A" && (
                <div className="movie-details-section awards-section">
                  <h3 className="section-title">
                    <img
                      src="/icons/trophy.svg"
                      className="badge-icon"
                    />
                    Награды
                  </h3>
                  <p className="section-content">{selectedMovie.Awards}</p>
                </div>
              )}

              {selectedMovie.BoxOffice && selectedMovie.BoxOffice !== "N/A" && (
                <div className="movie-details-section boxoffice-section">
                  <h3 className="section-title">
                    <img
                      src="/icons/circle-dollar-sign.svg"
                      className="badge-icon"
                    />
                    Кассовые сборы
                  </h3>
                  <p className="section-content boxoffice-value">
                    {selectedMovie.BoxOffice}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Content>
  );
}
