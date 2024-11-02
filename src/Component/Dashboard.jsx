import { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import Modal from "./Modal";

const PRODUCTS_PER_PAGE = 10;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("No Selection");
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchProducts() {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) {
      throw new Error("Error fetching");
    }
    const result = await response.json();
    setProducts(result.products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleSearch(e) {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }

  function handleProductClick(product) {
    setSelectedProduct(product);
    setIsOpen(true);
  }

  function handleCloseModal(e) {
    if (e.target.classList.contains("modal-overlay")) {
      setIsOpen(false);
    }
  }

  function handleFilter(e) {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  }

  function handleNextPage() {
    if (currentPage < Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  // Handle filtering based on the selected filter
  useEffect(() => {
    let filteredResults = [...products];

    if (filter === "Price (Low to High)") {
      filteredResults.sort((a, b) => a.price - b.price);
    } else if (filter === "Price (High to Low)") {
      filteredResults.sort((a, b) => b.price - a.price);
    } else if (filter === "Rating (High to Low)") {
      filteredResults.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(filteredResults);
  }, [filter, products]);

  // Handle searching within the filtered results
  useEffect(() => {
    let finalProducts = [...filtered];

    if (searchText.length > 0) {
      finalProducts = finalProducts.filter((p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setDisplayedProducts(finalProducts);
  }, [searchText, filtered]);

  // Calculate the products to be displayed for the current page
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = displayedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div>
      <div className="search-wrapper">
        <input
          className="input-search"
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search a product"
        />
      </div>
      <div className="filter-wrapper">
        <select name="" id="filter-select" onChange={handleFilter}>
          <option value="No Selection">No Selection</option>
          <option value="Price (Low to High)">Price (Low to High)</option>
          <option value="Price (High to Low)">Price (High to Low)</option>
          <option value="Rating (High to Low)">Rating (High to Low)</option>
        </select>
      </div>
      <div className="product-wrapper">
        {currentProducts &&
          currentProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => handleProductClick(p)}
            />
          ))}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)}
        </span>
        <button
          className="pagination-button"
          disabled={
            currentPage ===
            Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
          }
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      {isOpen && selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-wrapper">
            <Modal product={selectedProduct} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
