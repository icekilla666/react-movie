const API_KEY = "1ba07b7e";
const BASE_URL = "https://www.omdbapi.com";

export const movieSearch = async (searchTerm, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(
        searchTerm
      )}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Ошибка сети!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Ошибка при поиске фильмов:", error);
    throw error;
  }
};
