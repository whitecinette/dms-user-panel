import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import "./style.scss";
// import { jwtDecode } from "jwt-decode";

const { backend_url } = config;

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store fetched orders
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    status: "",
  }); // State to store filters
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const { startDate, endDate, search, status } = filters;

      const queryParams = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search }),  
        ...(status && { status }),
      }).toString();

        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("You are not authenticated. Please log in again.");
            return;
        }
    
        // Decode the token to extract dealer information
        // const decodedToken = jwtDecode(token);



        const response = await axios.post(
            `${backend_url}/dealer/orders`,
            {
              // Request body content goes here (if any)
              startDate: "",
              endDate: "",
              search: "",
              status: "",
            },
            // {
            //   headers: {
            //     Authorization: `Bearer ${token}`, // Correct placement of Authorization header
            //   },
            // }
          );
          

      setOrders(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes and fetch orders automatically
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Function to handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      search: "",
      status: "",
    });
  };


  return (
    <div className="orders-main">
      <h1>Orders</h1>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="End Date"
        />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
    <>
    <div className="orders-sub">

        {orders.map((order) => (
            <div key={order._id} className="order-box">
                <div className="order-dets-top">
                    <div className="order-dets-top-left">
                    <p>{order._id}</p>
                    <p className="order-tot-qt">{order.Products.reduce((total, product) => total + product.Quantity, 0)}N | {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(order.TotalPrice)} INR</p>
                    <p className="order-date">{new Date(order.OrderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {new Date(order.OrderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className={`order-status ${order.OrderStatus.toLowerCase()}`}>
                        {order.OrderStatus.toUpperCase()}
                    </div>
                    </div>
                        <div className="order-dets-top-right">
                        {order.OrderStatus.toUpperCase() === "PENDING" && (
                                <>
                                <a href="">Edit</a>
                                <a href="">Delete</a>
                                </>
                            )}
                        </div>
                </div>
                <div className="order-dets-bottom">
                    {order.Products.map((product) => (
                    <div key={product._id} className="order-products">
                        <div className="order-products-left">
                        <p className="product-name">
                            {product.Model} | {product.ProductCode}
                        </p>
                        <p className="product-price">
                        {product.Quantity} x {new Intl.NumberFormat('en-IN').format(product.Price)} INR
                        </p>
                        </div>
                        <div className="order-products-right">
                        <p className="order-total">
                        {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
                            product.Quantity * product.Price
                        )} INR
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        ))}


    </div>
    </>

      )}
    </div>
  );
};

export default Orders;
