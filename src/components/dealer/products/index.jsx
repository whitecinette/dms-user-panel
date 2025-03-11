import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss"; // Add custom CSS for styling
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import config from "../../../config";

const { backend_url } = config;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]); // Global Cart State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State

    // Filters
    const [query, setQuery] = useState("");
    const [segment, setSegment] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);
    }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8080/product/get-all-products") // Adjust API URL if needed
            .then((response) => {
                setProducts(response.data.products || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch products");
                setLoading(false);
            });
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

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

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
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            let updatedCart;

            if (existingItem) {
                updatedCart = prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                updatedCart = [...prevItems, { ...product, quantity }];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
            return updatedCart;
        });
    };

    const placeOrder = async (cartItems) => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const shopName = "Manga Shop"; // Replace dynamically
            const userId = "USER123"; // Replace with actual user ID
            const products = cartItems.map(item => ({
                ProductId: item._id,  // Change from ProductCode to ProductId
                ProductCode: item.ProductCode || "", // Ensure ProductCode exists
                Price: item.Price,
                Quantity: item.quantity
            }));
            if (products.length === 0) {
                alert("No valid products found!");
                return;
            }

            const orderDate = new Date().toISOString();

            const requestData = {
                UserId: userId,
                // DealerCode: dealerCode,
                ShopName: shopName,
                Products: products,
                orderDate,
                remarks: "Order placed via website"
            };

            console.log("Order Payload:", requestData); // Debugging

            const response = await axios.post(`${backend_url}/order/create-order`, requestData);

            if (response.status === 201) {
                alert("Order placed successfully!");
                setCartItems([]); // Clear cart
            }
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
            alert("Failed to place order. Please try again.");
        }
    };
    
    // 🔹 remove from Cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.filter(item => item._id !== productId);
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
            return updatedCart;
        });
    };
    
    // 🔹 Toggle Sidebar Cart
    const toggleSidebar = () => {
        setIsSidebarOpen(true);
    };

    // 🔹 **Filter Products Based on User Input**
    const filteredProducts = products.filter((product) => {
        return (
            (query === "" ||
                product.Model?.toLowerCase().includes(query.toLowerCase()) ||
                product.ProductCode?.toLowerCase().includes(query.toLowerCase()))
            &&
            (segment === "" || product.Segment === segment) &&
            (category === "" || product.Category === category) &&
            (minPrice === "" || (!isNaN(parseInt(minPrice)) && product.Price >= parseInt(minPrice))) &&
            (maxPrice === "" || (!isNaN(parseInt(maxPrice)) && product.Price <= parseInt(maxPrice)))
        );
    });

    // 🔹 **Reset Filters**
    const resetFilters = () => {
        setQuery("");
        setSegment("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
    };

    return (
        <div className="product-page">
            {/* 🔹 **Cart Icon with Dynamic Count** */}
            <div className="cart-icon">
                <div>
                    <h2>Product List:</h2>
                </div>
                <div>
                    <Badge
                        badgeContent={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        color="primary"
                    >
                        {/* ✅ Ensure both icons trigger toggleSidebar */}
                        {cartItems.length > 0 ? (
                            <ShoppingCartCheckoutIcon fontSize="large" onClick={toggleSidebar} />
                        ) : (
                            <AddShoppingCartIcon fontSize="large" onClick={toggleSidebar} />
                        )}
                    </Badge>
                </div>
                {/* 🔹 Sidebar Cart */}
                <div className={`cart-sidebar ${isSidebarOpen ? "open" : ""}`}>
                    <div className="cart-header">
                        <h2>Your Orders :-</h2>
                        <CloseIcon className="close-btn" onClick={() => setIsSidebarOpen(false)} />
                    </div>
                    <div className="cart-body">
                        {cartItems.length > 0 ? (
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <img src={item.Image || "../../sc.jpg"} alt={item.Model} width={50} />
                                        <div>
                                            <p>{item.Brand} - {item.Model}</p>
                                            <p>₹{item.Price} x {item.quantity} = ₹{item.Price * item.quantity}</p>
                                        </div>
                                        <div className="close-btn" onClick={() => removeFromCart(item._id)}>
                                            <CloseIcon />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-cart">Your cart is empty</p> // ✅ Still shows the sidebar
                        )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="place-order-btn" onClick={() => placeOrder([...cartItems])}>Place order</button>
                    </div>
                </div>

            </div>
            {/* 🔹 **Filters Section** */}
            <div className="filters sticky-filters">
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select value={segment} onChange={(e) => setSegment(e.target.value)}>
                    <option value="">All Segments</option>
                    <option value="6-10K">6-10K</option>
                    <option value="10-15K">10-15K</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="smartphone">Smartphones</option>
                    <option value="tab">Tablets</option>
                    <option value="wearable">Wearable</option>
                </select>
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
                <button onClick={resetFilters}>Reset Filters</button>
            </div>



            {/* 🔹 **Product List** */}
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                    ))
                ) : (
                    <p>No products match the selected filters.</p>
                )}
            </div>
        </div>
    );
};

// 🔹 **ProductCard Component**
const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => setQuantity(quantity + 1);
    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        <div className="product-card">
            <div className="product-category">
                <label><strong>{product.Category}</strong></label>
            </div>
            <div className="product-image">
                <img src={product.Image || "../../sc.jpg"} width={200} alt={product.Model} />
            </div>
            <div className="product-details">
                <h3>{product.Brand} - {product.Model}</h3>
                <p>{product.ProductCode}</p>
                <p><strong> ₹{product.Price}</strong></p>
                {/* <p>{product.Status}</p> */}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                {/* Quantity Selector */}
                <div className="quantity-wrapper">
                    <button className="qty-btn" onClick={decreaseQty} disabled={quantity === 1}>-</button>
                    <input type="number" value={quantity} min="1" readOnly />
                    <button className="qty-btn" onClick={increaseQty}>+</button>
                </div>

                {/* Add to Cart Button */}
                <div className="cart-action">
                    <button className="cart-btn" onClick={() => onAddToCart(product, quantity)}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
