import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import "./style.scss";
// import { jwtDecode } from "jwt-decode";

const { backend_url } = config;

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store all orders
  const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not authenticated. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${backend_url}/order/get-all-orders-by-dealer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
      setFilteredOrders(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...orders];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((order) =>
        order.OrderNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(
        (order) =>
          order.OrderStatus.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((order) => new Date(order.OrderDate) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      result = result.filter((order) => new Date(order.OrderDate) <= endDate);
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  // Handle filter input changes
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

  // Initial fetch of orders
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-main">
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
          placeholder="Search by Order Number or Product"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="orders-sub">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-box">
                <div className="order-dets-top">
                  <div className="order-dets-top-left">
                    <p>Order Number: {order.OrderNumber}</p>
                    <p className="order-tot-qt">
                      Total Quantity:{" "}
                      {order.Products.reduce(
                        (total, product) => total + product.Quantity,
                        0
                      )}{" "}
                      | Total Price:{" "}
                      {new Intl.NumberFormat("en-IN", {
                        maximumFractionDigits: 2,
                      }).format(order.TotalPrice)}{" "}
                      INR
                    </p>
                    <p className="order-date">
                      Order Date:{" "}
                      {new Date(order.OrderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      | Order Time:{" "}
                      {new Date(order.OrderDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {order.DeliveryDate && (
                      <p className="delivery-date">
                        Delivery Date:{" "}
                        {new Date(order.DeliveryDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        | Delivery Time:{" "}
                        {new Date(order.DeliveryDate).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <div
                    className={`order-status ${order.OrderStatus.toLowerCase()}`}
                  >
                    {order.OrderStatus.toUpperCase()}
                  </div>
                </div>
                <div className="order-dets-bottom">
                  <div className="order-products-container">
                    {order.Products.map((product) => (
                      <div key={product._id} className="order-products">
                        <div className="order-products-left">
                          <p className="product-name">
                            {product.ProductId.product_name}
                          </p>
                          <p className="product-price">
                            {product.Quantity} x{" "}
                            {new Intl.NumberFormat("en-IN").format(
                              product.ProductId.price
                            )}{" "}
                            INR
                          </p>
                        </div>
                        <div className="order-products-right">
                          <p className="order-total">
                            {new Intl.NumberFormat("en-IN", {
                              maximumFractionDigits: 2,
                            }).format(
                              product.Quantity * product.ProductId.price
                            )}{" "}
                            INR
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="order-total">
                    Total Price:
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: 2,
                    }).format(order.TotalPrice)}{" "}
                    INR
                  </p>
                  <p className="order-remark">
                    Remark: {order.Remark || "No remark"}
                  </p>
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
