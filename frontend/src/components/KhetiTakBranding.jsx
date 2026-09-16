import React from "react";

/**
 * Official KhetiTak Concept 2 ("Grain K") Design System:
 * - Cream background: #FBF8F2
 * - Marigold/turmeric: #E8A33D
 * - Soil terracotta: #C1440E
 * - Supporting green: #4C7A3A
 * - Near-black text: #2B2118
 */

/**
 * Concept 2 Mark Only (Icon / Favicon / Button mark)
 * Grain stalk on left (#E8A33D) + Terracotta K arrow (#C1440E) + Map pin with white hole (#C1440E)
 */
export function KhetiTakMark({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KhetiTak Logo Mark"
      style={{ flexShrink: 0 }}
    >
      {/* 🌾 Marigold Grain Stalk on Left */}
      <g fill="#E8A33D">
        <path d="M 28 8 C 28 8, 23 18, 28 26 C 33 18, 28 8, 28 8 Z" />
        <path d="M 17 18 C 12 24, 15 35, 25 33 C 24 25, 20 20, 17 18 Z" />
        <path d="M 39 18 C 42 20, 38 28, 31 33 C 37 35, 44 24, 39 18 Z" />
        <path d="M 15 35 C 10 42, 14 53, 24 50 C 23 42, 18 37, 15 35 Z" />
        <path d="M 41 35 C 44 37, 39 45, 31 50 C 38 53, 46 42, 41 35 Z" />
        <path d="M 14 53 C 10 61, 14 71, 24 67 C 23 59, 18 55, 14 53 Z" />
        <path d="M 42 53 C 45 55, 39 63, 31 67 C 38 71, 46 61, 42 53 Z" />
        <path d="M 16 71 C 13 78, 17 86, 25 83 C 24 77, 19 73, 16 71 Z" />
        <path d="M 40 71 C 43 73, 38 80, 31 83 C 37 86, 43 78, 40 71 Z" />
        <path d="M 28 22 Q 27 55 28 90" stroke="#E8A33D" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* 🪓 Bold Terracotta Arrow 'K' letterform */}
      <path
        d="M 52 50 L 80 18 L 94 30 L 68 50 Z"
        fill="#C1440E"
      />
      <path
        d="M 52 50 L 68 50 L 83 72 L 72 82 Z"
        fill="#C1440E"
      />

      {/* 📍 Map-Pin icon at bottom-right tip with white circular cutout */}
      <g>
        <path
          d="M 85 54 C 79.5 54 75 58.5 75 64 C 75 71.5 85 82 85 82 C 85 82 95 71.5 95 64 C 95 58.5 90.5 54 85 54 Z"
          fill="#C1440E"
        />
        <circle cx="85" cy="63.5" r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/**
 * Concept 2 Full Logo with Wordmark:
 * Mark + "Kheti" (#2B2118 near-black) + "Tak" (#E8A33D marigold)
 */
export function KhetiTakLogo({ size = 32, showTagline = false, className = "", style = {} }) {
  return (
    <div
      className="khetitak-brand-logo"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size > 40 ? "10px" : "7px",
        userSelect: "none",
        ...style,
      }}
    >
      <KhetiTakMark size={size} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-headings)",
            fontWeight: "800",
            fontSize: `${Math.round(size * 0.7)}px`,
            letterSpacing: "-0.02em",
            display: "inline-flex",
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "#2B2118" }}>Kheti</span>
          <span style={{ color: "#B36B00" }}>Tak</span>
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: "var(--font-headings)",
              fontSize: `${Math.max(11, Math.round(size * 0.35))}px`,
              fontWeight: "600",
              color: "#6B645A",
              marginTop: "3px",
            }}
          >
            खेती का भरोसा, आपके पास
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Concept 2 AgriStore Feature Card Component (as shown in reference sheet)
 * Includes "AgriStore" pill, Concept 2 logo + wordmark, headline, "Shop Now →", and product illustration
 */
export function AgriStoreConceptCard({ onShopNow, style = {} }) {
  return (
    <div
      className="khetitak-agristore-banner"
      style={{
        backgroundColor: "#FBF8F2",
        border: "1.5px solid #EDE6D8",
        borderRadius: "16px",
        padding: "22px 26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "18px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(43, 33, 24, 0.05)",
        ...style,
      }}
    >
      {/* Left Content */}
      <div style={{ zIndex: 2, maxWidth: "420px" }}>
        {/* Pill */}
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#C1440E",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: "700",
            padding: "3px 9px",
            borderRadius: "6px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          AgriStore
        </span>

        {/* Concept 2 Brand Header */}
        <div style={{ marginBottom: "8px" }}>
          <KhetiTakLogo size={28} />
        </div>

        {/* Headline exact text from reference */}
        <h3
          style={{
            fontFamily: "var(--font-headings)",
            fontSize: "18px",
            fontWeight: "700",
            color: "#2B2118",
            margin: "0 0 14px 0",
            lineHeight: "1.3",
          }}
        >
          Quality Inputs, Better Yields
        </h3>

        {/* Shop Now CTA */}
        <button
          onClick={onShopNow}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#C1440E",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "9px 18px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(193, 68, 14, 0.28)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A73809")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C1440E")}
        >
          <span>Shop Now</span>
          <span style={{ fontSize: "16px" }}>→</span>
        </button>
      </div>

      {/* Right Product Illustration (Jars, Bags, Fertilizer) */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          zIndex: 2,
        }}
      >
        <svg width="170" height="110" viewBox="0 0 170 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wheat mound pile on left */}
          <ellipse cx="40" cy="94" rx="26" ry="10" fill="#E8A33D" opacity="0.35" />
          <path d="M 22 96 Q 40 68 58 96 Z" fill="#E8A33D" />
          <circle cx="32" cy="88" r="2" fill="#C1440E" opacity="0.8" />
          <circle cx="43" cy="82" r="2" fill="#C1440E" opacity="0.8" />
          <circle cx="47" cy="90" r="2" fill="#C1440E" opacity="0.8" />

          {/* Fertilizer / Seed Sack */}
          <g>
            <path
              d="M 64 40 C 64 40, 75 35, 108 40 C 114 50, 118 88, 116 97 C 103 100, 71 100, 61 97 C 58 85, 61 50, 64 40 Z"
              fill="#DDB683"
              stroke="#B58D56"
              strokeWidth="2"
            />
            <path d="M 62 43 Q 86 47 110 43" stroke="#8A6331" strokeWidth="2" fill="none" />
            <path d="M 68 35 L 105 35 L 109 43 L 64 43 Z" fill="#C69E68" />
            
            {/* Green plant emblem on bag */}
            <path d="M 86 76 Q 86 63 86 59" stroke="#4C7A3A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 86 68 C 80 65, 78 59, 78 59 C 78 59, 84 59, 86 65" fill="#4C7A3A" />
            <path d="M 86 65 C 92 62, 94 56, 94 56 C 94 56, 88 56, 86 62" fill="#4C7A3A" />
          </g>

          {/* Certified spray bottle / medicine jar */}
          <g>
            <rect x="122" y="62" width="26" height="36" rx="4" fill="#7A4E2D" />
            <rect x="127" y="56" width="16" height="6" rx="2" fill="#E8A33D" />
            <rect x="125" y="72" width="20" height="16" rx="2" fill="#FBF8F2" />
            <line x1="129" y1="77" x2="141" y2="77" stroke="#4C7A3A" strokeWidth="2" />
            <line x1="129" y1="82" x2="137" y2="82" stroke="#C1440E" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Decorative background curve */}
      <div
        style={{
          position: "absolute",
          right: "-30px",
          bottom: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          backgroundColor: "#F3EAD8",
          zIndex: 1,
          opacity: 0.6,
        }}
      />
    </div>
  );
}

/**
 * Concept 2 Splash Screen Component
 * Matches the phone-mockup in Concept 2 column:
 * - Cream background (#FBF8F2)
 * - Concept 2 Mark
 * - Wordmark "KhetiTak" ("Kheti" in #2B2118, "Tak" in #E8A33D)
 * - Hindi Tagline "खेती का भरोसा, आपके पास"
 * - Rolling hills field illustration at bottom (sunrise, farm house, trees, tilled field)
 */
export function KhetiTakSplash({ onContinue }) {
  return (
    <div
      className="splash-screen"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#FBF8F2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 20px 0 20px",
        overflow: "hidden",
      }}
    >
      {/* Top Branding Section */}
      <div
        className="splash-branding"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: "40px",
          zIndex: 10,
        }}
      >
        <div className="splash-mark" style={{ marginBottom: "18px" }}>
          <KhetiTakMark size={96} />
        </div>

        <h1
          className="splash-wordmark"
          style={{
            fontFamily: "var(--font-headings)",
            fontSize: "40px",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            margin: "0 0 6px 0",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#2B2118" }}>Kheti</span>
          <span style={{ color: "#E8A33D" }}>Tak</span>
        </h1>

        <p
          className="splash-tagline"
          style={{
            fontFamily: "var(--font-headings)",
            fontSize: "16px",
            fontWeight: "600",
            color: "#6B645A",
            margin: "0 0 20px 0",
          }}
        >
          खेती का भरोसा, आपके पास
        </p>

        {/* Real App Cold-Start Loading Indicator */}
        <div className="splash-loader" style={{ width: "160px", margin: "8px auto 0 auto" }}>
          <div className="growing-bar" style={{ height: "4px", borderRadius: "3px" }} />
        </div>
      </div>

      {/* Bottom Rolling Hills Field Illustration */}
      <div className="splash-illustration" style={{ width: "100%", maxWidth: "560px", zIndex: 1, lineHeight: 0 }}>
        <svg
          viewBox="0 0 500 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Sunrise behind horizon */}
          <circle cx="250" cy="130" r="30" fill="#E8A33D" opacity="0.85" />

          {/* Distant Trees & Farm Hut on Hill */}
          <rect x="330" y="112" width="20" height="14" fill="#7A4E2D" rx="2" />
          <polygon points="326,112 340,100 354,112" fill="#C1440E" />
          <circle cx="364" cy="115" r="8" fill="#4C7A3A" />
          <circle cx="374" cy="117" r="6" fill="#4C7A3A" />
          <circle cx="120" cy="118" r="9" fill="#4C7A3A" />

          {/* Rolling Hill 1 */}
          <path
            d="M 0 150 Q 140 125 250 138 T 500 142 L 500 220 L 0 220 Z"
            fill="#D9A05B"
            opacity="0.6"
          />

          {/* Rolling Hill 2 */}
          <path
            d="M 0 165 Q 180 132 340 155 T 500 160 L 500 220 L 0 220 Z"
            fill="#C87A32"
            opacity="0.85"
          />

          {/* Foreground Terracotta Tilled Rows */}
          <path
            d="M 0 182 Q 220 150 500 172 L 500 220 L 0 220 Z"
            fill="#A73809"
          />

          {/* Tilled Field Perspective Lines */}
          <line x1="250" y1="150" x2="60" y2="220" stroke="#782402" strokeWidth="2.5" opacity="0.7" />
          <line x1="250" y1="150" x2="160" y2="220" stroke="#782402" strokeWidth="2.5" opacity="0.7" />
          <line x1="250" y1="150" x2="270" y2="220" stroke="#782402" strokeWidth="2.5" opacity="0.7" />
          <line x1="250" y1="150" x2="380" y2="220" stroke="#782402" strokeWidth="2.5" opacity="0.7" />
          <line x1="250" y1="150" x2="470" y2="220" stroke="#782402" strokeWidth="2.5" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
