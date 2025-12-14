import "./Modal.css";

export default function Modal({ children, open, onClose }) {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("movie-modal") && onClose) {
      onClose();
    }
  };

  return (
    <div className="movie-modal" onClick={handleBackdropClick}>
      <div
        className="modal-content-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
