function Modal({ product, setIsOpen }) {
  function handleClose() {
    setIsOpen(false);
  }
  return (
    <div className="modal-wrapper">
      <h2>{product.title}</h2>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}

export default Modal;
