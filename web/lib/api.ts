export async function fetchListings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}
