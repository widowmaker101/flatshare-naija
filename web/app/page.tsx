import { fetchListings } from "../lib/api";

export default async function Home() {
  const listings = await fetchListings();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Flatshare Naija Frontend</h1>
      <ul className="mt-4 space-y-2">
        {listings.map((listing: any) => (
          <li key={listing.id} className="border p-2 rounded">
            {listing.title} — ₦{listing.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
