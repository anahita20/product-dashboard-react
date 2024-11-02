import { useState } from "react";
import Modal from "./Modal";

function ProductCard({ product, onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  function handleClick() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  window.addEventListener("mousedown", handleClose);

  return (
    <div className="product-card" onClick={onClick}>
      <h3>{product.title}</h3>
      <div className="card-content">
        <img
          src={product.thumbnail}
          alt="product thumbnail"
          style={{ width: "100%" }}
          onClick={handleClick}
        />
        <p className="card-price">${product.price}</p>
        <p className="card-rating">{product.rating}</p>
      </div>
    </div>
  );
}

export default ProductCard;
