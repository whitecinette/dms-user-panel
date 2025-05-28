import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss"; // Add custom CSS for styling
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../../config";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomAlert from "../../../components/CustomAlert";

const { backend_url } = config;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Global Cart State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Enhanced filters
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false); // For mobile filter toggle
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [remark, setRemark] = useState("");
  const [quantityMap, setQuantityMap] = useState({});


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const emptyCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const fetchProducts = async () => {
   try {
     const response = await axios.get(`${backend_url}/dealer/get-all-products`);
     setProducts(response.data.data || []);
   } catch (error) {
     setError("Failed to fetch products");
   } finally {
     setLoading(false);
   }
 };
 useEffect(() => {
  fetchProducts();
}, []);
  // =============================================================================
  // If you're fetching cart items from the backend, use this instead:

  // useEffect(() => {
  //     const userId = "USER123"; // Replace with actual user ID
  //     axios.get(`http://localhost:8080/cart/${userId}`)
  //         .then((response) => {
  //             setCartItems(response.data.products);
  //         })
  //         .catch(() => {
  //             console.error("Failed to load cart");
  //         });
  // }, []);
  // =============================================================================

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  // 🔹 Handle Add to Cart Logic
  // const handleAddToCart = (product, quantity = 1) => {
  //     setCartItems(prevItems => {
  //         const existingItem = prevItems.find(item => item._id === product._id);
  //         if (existingItem) {
  //             return prevItems.map(item =>
  //                 item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
  //             );
  //         } else {
  //             return [...prevItems, { ...product, quantity }];
  //         }
  //     });
  // };
  const handleAddToCart = (product, quantity = 1) => {
   if (quantity <= 0) {
     setAlert({
       open: true,
       message: "Please enter a valid quantity!",
       type: "warning",
     });
     setTimeout(() => setAlert((a) => ({ ...a, open: false })), 2000);
     return;
   }
 
   setCartItems((prevItems) => {
     const existingItem = prevItems.find((item) => item._id === product._id);
     let updatedCart;
 
     if (existingItem) {
       updatedCart = prevItems.map((item) =>
         item._id === product._id
           ? { ...item, quantity: item.quantity + quantity }
           : item
       );
     } else {
       updatedCart = [...prevItems, { ...product, quantity }];
     }
 
     localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
     return updatedCart;
   });
 
   setAlert({
     open: true,
     message: `Added ${product.product_name} to cart!`,
     type: "success",
   });
   setTimeout(() => setAlert((a) => ({ ...a, open: false })), 2000);
 };
 

  const placeOrder = async (cartItems) => {
    if (cartItems.length === 0) {
      setAlert({
        open: true,
        message: "Your cart is empty!",
        type: "warning",
      });
      setTimeout(() => setAlert((a) => ({ ...a, open: false })), 2000);
      return;
    }

    try {
      const products = cartItems.map((item) => ({
        ProductId: item._id,
        Quantity: item.quantity,
      }));

      if (products.length === 0) {
        setAlert({
          open: true,
          message: "No valid products found!",
          type: "warning",
        });
        setTimeout(() => setAlert((a) => ({ ...a, open: false })), 2000);
        return;
      }

      const requestData = {
        Products: products,
        Remark: remark || "",
      };

      console.log("Order Payload:", requestData); // Debugging

      const response = await axios.post(
        `${backend_url}/order/add-order-by-dealer`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setAlert({
          open: true,
          message: "Order requested successfully!",
          type: "success",
        });
        setCartItems([]); // Clear cart
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      setAlert({
        open: true,
        message: "Failed to place order. Please try again.",
        type: "error",
      });
    }
  };

  // 🔹 remove from Cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
      return updatedCart;
    });
  };

  // 🔹 Toggle Sidebar Cart
  const toggleSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Enhanced filter function
  const filteredProducts = products
    .filter((product) => {
      return (
        (query === "" ||
          product.product_name?.toLowerCase().includes(query.toLowerCase()) ||
          product.product_code?.toLowerCase().includes(query.toLowerCase()) ||
          product.model_code?.toLowerCase().includes(query.toLowerCase())) &&
        (segment === "" || product.segment === segment) &&
        (category === "" || product.product_category === category) &&
        (minPrice === "" ||
          (!isNaN(parseInt(minPrice)) &&
            product.price >= parseInt(minPrice))) &&
        (maxPrice === "" ||
          (!isNaN(parseInt(maxPrice)) && product.price <= parseInt(maxPrice)))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.product_name.localeCompare(b.product_name);
        case "name_desc":
          return b.product_name.localeCompare(a.product_name);
        default:
          return 0;
      }
    });

  // Get unique values for filters
  const uniqueSegments = [...new Set(products.map((p) => p.segment))].filter(
    Boolean
  );
  const uniqueCategories = [
    ...new Set(products.map((p) => p.product_category)),
  ].filter(Boolean);

  const resetFilters = () => {
    setQuery("");
    setSegment("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("price_asc");
  };
  const handleQuantityChange = (productId, value) => {
   if (value > 0) {
     setQuantityMap((prev) => ({
       ...prev,
       [productId]: value,
     }));
   }
 };
 
  return (
    <div className="product-page">
      {alert.open && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((a) => ({ ...a, open: false }))}
        />
      )}
      {/* Enhanced Filters Section */}
      <div
        className="filters-section"
        // No style prop here, always show on desktop
      >
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, model, or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="cart-icon">
            <Badge
              badgeContent={cartItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              )}
              color="primary"
            >
              {cartItems.length > 0 ? (
                <ShoppingCartCheckoutIcon
                  fontSize="large"
                  onClick={toggleSidebar}
                />
              ) : (
                <AddShoppingCartIcon fontSize="large" onClick={toggleSidebar} />
              )}
            </Badge>
          </div>
        </div>

        {/* More Filters Button for Mobile */}
        {isMobile && (
          <button
            className="more-filters-btn"
            onClick={() => setShowMobileFilters((prev) => !prev)}
          >
            {showMobileFilters ? "Hide Filters" : "More Filters"}
          </button>
        )}

        {/* Main filter controls: always visible on desktop, toggled on mobile */}
        {(!isMobile || showMobileFilters) && (
          <div className="filter-controls">
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            >
              <option value="">All Segments</option>
              {uniqueSegments.map((seg) => (
                <option key={seg} value={seg}>
                  {seg}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="price-range">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>

            <button className="reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="product-table">
  {filteredProducts.length > 0 ? (
    <div className="table-scroll-container">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Segment</th>
            <th>Name</th>
            <th>Model Code</th>
            <th>Product Code</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            const productQuantity = quantityMap[product._id] || 1;

            return (
              <tr key={product._id}>
                <td>{product.product_category}</td>
                <td>{product.segment}</td>
                <td>{product.product_name}</td>
                <td>{product.model_code}</td>
                <td>{product.product_code}</td>
                <td>₹{product.price}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={productQuantity}
                    onChange={(e) =>
                      handleQuantityChange(product._id, Number(e.target.value))
                    }
                    style={{ width: "60px" }}
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleAddToCart(product, productQuantity)
                    }
                  >
                    Add
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="no-products">No products match the selected filters.</div>
  )}
</div>



      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <CloseIcon
            className="close-btn"
            size={24}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="cart-body">
          {cartItems.length > 0 ? (
            <div className="cart-items">
              <div className="cart-item-container">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-details">
                      <h3>{item.product_name}</h3>
                      <p>Model: {item.model_code}</p>
                      <p>
                        ₹{item.price} x {item.quantity} = ₹
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <CloseIcon
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>
                  Total: ₹
                  {cartItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </h3>
                <input
                  className="remark-input"
                  type="text"
                  placeholder="Remark (optional)"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <button
                  className="place-order-btn"
                  onClick={() => placeOrder([...cartItems])}
                >
                  Request Order
                </button>
                <button className="empty-cart-btn" onClick={emptyCart}>
                  Empty Cart
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-cart">Your cart is empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated ProductCard Component
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity(quantity + 1);
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <span className="category-tag">{product.product_category}</span>
        <span className="segment-tag">{product.segment}K</span>
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.product_name}</h3>
        <p className="model-code">Model: {product.model_code}</p>
        <p className="product-code">Code: {product.product_code}</p>
        <p className="price">{product.price}</p>
      </div>

      <div className="product-actions">
        <div className="quantity-controls">
          <input
            type="number"
            className="quantity-input"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product, quantity)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Products;
