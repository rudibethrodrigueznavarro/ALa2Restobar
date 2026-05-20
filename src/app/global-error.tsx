"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#131313",
          color: "#e5e2e1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Algo salió mal</h2>
        <button
          onClick={() => unstable_retry()}
          style={{
            padding: "10px 24px",
            background: "#e63946",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Intentar de nuevo
        </button>
      </body>
    </html>
  );
}
