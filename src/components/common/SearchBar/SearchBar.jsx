import "./SearchBar.css";

export default function SearchBar({ onSearchChange, searchValue, submitSearch }) {

  return (
    <form className="search-bar" onSubmit={submitSearch}>
      <div className="search-bar__container">
        <input
          type="search"
          className="search-bar__input"
          placeholder="Введите название фильма"
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchValue}
        />
        <button type="submit" className="search-bar__button">
          <img src="/icons/search.svg" alt="search" />
        </button>
      </div>
    </form>
  );
}
