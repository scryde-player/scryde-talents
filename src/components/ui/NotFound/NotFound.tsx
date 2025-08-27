import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        color: "#ffffff",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>
        404 - Страница не найдена
      </h1>
      <p style={{ marginBottom: 16 }}>Запрошенная страница не существует</p>

      <Link href={"/"} style={{ textDecoration: "underline" }}>
        Вернуться на главную
      </Link>
    </div>
  );
}
