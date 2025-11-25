export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Flatshare Naija Frontend</h1>
      <p>Connected to backend API at {process.env.NEXT_PUBLIC_API_URL}</p>
    </main>
  );
}
