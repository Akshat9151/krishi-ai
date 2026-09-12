import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Star, Check, Tag, Eye, X, PackageCheck, ArrowRight, Sparkles } from "lucide-react";
import { storeApi } from "../services/api";
import { useCart } from "../context/CartContext";

export default function AgriStore({ setCurrentView }) {
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const loadStore = async () => {
      setLoading(true);
      try {
        const [cats, prods, feat] = await Promise.all([
          storeApi.getCategories().catch(() => []),
          storeApi.getProducts({ limit: 40 }),
          storeApi.getFeatured(4).catch(() => []),
        ]);
        setCategories(cats);
        setProducts(prods);
        setFeaturedProducts(feat);
      } catch (err) {
        console.error("AgriStore error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStore();
  }, []);

  const handleCategoryChange = async (catName) => {
    setSelectedCategory(catName);
    setLoading(true);
    try {
      if (catName === "all") {
        const prods = await storeApi.getProducts({ limit: 50 });
        setProducts(prods);
      } else {
        const prods = await storeApi.getProducts({ category: catName, limit: 50 });
        setProducts(prods);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleCategoryChange("all");
      return;
    }
    setLoading(true);
    try {
      const results = await storeApi.search(searchQuery);
      setProducts(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, qty = 1) => {
    addToCart(product, qty);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner & Header */}
      <div
        className="ka-card"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, var(--marigold-light) 100%)",
          borderColor: "var(--marigold)",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <span className="badge-marigold">DIRECT VILLAGE APMC STORE</span>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginTop: "4px" }}>
            AgriStore Village Market (कृषि बाज़ार)
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", margin: 0 }}>
            Certified fertilizers, hybrid seeds, and protective gear delivered to your farm with Cash on Delivery.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-secondary"
            onClick={() => setCurrentView("orders")}
            style={{ fontSize: "13px" }}
          >
            <PackageCheck size={16} />
            <span>My Orders</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => setIsCartOpen(true)}
            style={{ fontSize: "13px" }}
          >
            <ShoppingCart size={16} />
            <span>View Cart</span>
          </button>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search seeds, urea, DAP, spray pumps, fungicides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "38px" }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: "0 18px" }}>
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            className={`chip ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            All Products (सभी उत्पाद)
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat.name)}
            >
              {cat.display_name || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals Row (if on 'all') */}
      {selectedCategory === "all" && featuredProducts.length > 0 && !searchQuery && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Tag size={18} color="var(--terracotta)" />
            <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
              Top Deals & Farmer Favorites (विशेष छूट)
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
            {featuredProducts.map((p) => (
              <div
                key={`feat-${p.id}`}
                className="ka-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "14px",
                  borderColor: "var(--marigold)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div>
                  <div style={{ position: "relative" }}>
                    <img
                      src={p.image_url || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300"}
                      alt={p.name}
                      style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: "var(--terracotta)",
                        color: "#FFFFFF",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {p.badge || "Featured"}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      marginTop: "10px",
                      lineHeight: "1.3",
                    }}
                  >
                    {p.name}
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {p.brand} • {p.weight || p.unit || "1 unit"}
                  </p>
                </div>

                <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--terracotta)" }}>
                      ₹{p.price}
                    </span>
                    {p.original_price && (
                      <span style={{ fontSize: "12px", textDecoration: "line-through", color: "var(--text-muted)", marginLeft: "6px" }}>
                        ₹{p.original_price}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn-primary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                    onClick={() => handleAddToCart(p)}
                  >
                    {addedId === p.id ? <Check size={14} /> : <ShoppingCart size={14} />}
                    <span>{addedId === p.id ? "Added" : "Buy"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Products Grid */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px" }}>
          All Products ({products.length})
        </h3>

        {loading ? (
          <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
            <span style={{ fontSize: "36px" }}>🛒</span>
            <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Loading authentic village catalog...</h4>
            <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
          </div>
        ) : products.length === 0 ? (
          <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="ka-card ka-card-interactive"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedProductModal(product);
                  setModalQty(1);
                }}
              >
                <div>
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        backgroundColor: "var(--bg-cream)",
                      }}
                      loading="lazy"
                    />
                    {product.discount_percentage > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: "var(--terracotta)",
                          color: "#FFFFFF",
                          padding: "2px 7px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {Math.round(product.discount_percentage)}% OFF
                      </span>
                    )}
                  </div>

                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      marginTop: "10px",
                      lineHeight: "1.3",
                    }}
                  >
                    {product.name}
                  </h4>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <Star size={13} color="var(--marigold)" fill="var(--marigold)" />
                    <span style={{ fontWeight: "700" }}>{product.rating || "4.6"}</span>
                    <span>({product.reviews_count || 32})</span>
                    <span>• {product.brand}</span>
                  </div>
                </div>

                <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "17px", fontWeight: "800", color: "var(--terracotta)" }}>
                      ₹{product.price}
                    </span>
                    {product.original_price && (
                      <span style={{ fontSize: "12px", textDecoration: "line-through", color: "var(--text-muted)", marginLeft: "6px" }}>
                        ₹{product.original_price}
                      </span>
                    )}
                  </div>

                  <button
                    className="btn-primary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {addedId === product.id ? <Check size={14} /> : <ShoppingCart size={14} />}
                    <span>{addedId === product.id ? "Added" : "Add"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProductModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(43, 33, 24, 0.5)",
            backdropFilter: "blur(3px)",
            padding: "16px",
          }}
          onClick={() => setSelectedProductModal(null)}
        >
          <div
            className="ka-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              backgroundColor: "#FFFFFF",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <span className="badge-marigold">{selectedProductModal.category}</span>
              <button
                onClick={() => setSelectedProductModal(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedProductModal.image_url || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500"}
              alt={selectedProductModal.name}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", marginBottom: "16px" }}
            />

            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>
              {selectedProductModal.name}
            </h3>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Brand: <strong>{selectedProductModal.brand}</strong> | Weight: <strong>{selectedProductModal.weight || selectedProductModal.unit || "1 unit"}</strong>
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "14px 0" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--terracotta)" }}>
                ₹{selectedProductModal.price}
              </span>
              {selectedProductModal.original_price && (
                <span style={{ fontSize: "14px", textDecoration: "line-through", color: "var(--text-muted)" }}>
                  ₹{selectedProductModal.original_price}
                </span>
              )}
            </div>

            <div style={{ padding: "12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)", marginBottom: "18px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                PRODUCT DETAILS & USAGE:
              </span>
              <p style={{ fontSize: "13px", color: "var(--text-primary)", marginTop: "4px", lineHeight: "1.4" }}>
                {selectedProductModal.description || "Certified agricultural product formulated for Indian field and horticulture crops."}
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "12px" }}
              onClick={() => {
                handleAddToCart(selectedProductModal, modalQty);
                setSelectedProductModal(null);
              }}
            >
              <ShoppingCart size={16} />
              <span>Add to AgriCart (₹{selectedProductModal.price * modalQty})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
