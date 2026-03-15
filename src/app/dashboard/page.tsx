export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e2d4a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to somoBloom
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.6 }}>
          You have successfully logged in to your portal. Full dashboard
          features are being activated.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
