import { Layout, Card, Flex, Spin } from "antd";
import { useState, useEffect } from "react";
import SearchBar from "../../common/SearchBar/SearchBar";
import { movieSearch } from "../../../services/movieApi";
import Modal from "../../common/Modal/Modal";
import "./AppContent.css";

const { Content } = Layout;

const contentStyle = {
  textAlign: "center",
  minHeight: "100vh",
  color: "#fff",
  background: "#0f0f1a",
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

  // useEffect(() => {
  //   apiSearchMovies("john");
  // }, []);

  function systemSearch(event) {
    event.preventDefault();
    apiSearchMovies(searchValue);
  }
  const detaliesCard = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };
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
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
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
                  <span className="movie-details-year">{selectedMovie.Year}</span>
                )}
                {selectedMovie.Type && (
                  <span className="movie-details-type">{selectedMovie.Type}</span>
                )}
              </div>
              
              {selectedMovie.imdbID && (
                <div className="movie-details-rating">
                  <span className="rating-label">IMDb ID:</span>
                  <span className="rating-value">{selectedMovie.imdbID}</span>
                </div>
              )}
              
              {selectedMovie.Plot && (
                <div className="movie-details-description">
                  <h3>Описание</h3>
                  <p>{selectedMovie.Plot}</p>
                </div>
              )}
              
              {selectedMovie.Genre && (
                <div className="movie-details-genre">
                  <h3>Жанр</h3>
                  <p>{selectedMovie.Genre}</p>
                </div>
              )}
              
              {selectedMovie.Director && (
                <div className="movie-details-director">
                  <h3>Режиссер</h3>
                  <p>{selectedMovie.Director}</p>
                </div>
              )}
              
              {selectedMovie.Actors && (
                <div className="movie-details-actors">
                  <h3>Актеры</h3>
                  <p>{selectedMovie.Actors}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Content>
  );
}
