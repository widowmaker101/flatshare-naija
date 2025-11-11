'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Users, Filter } from 'lucide-react';
import { Database } from '@/types/supabase';

type Listing = Database['public']['Tables']['listings']['Row'];

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.details || err.error || 'Unknown error');
        }
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filtered = Array.isArray(listings)
    ? listings.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) &&
        (!location || l.location === location)
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading listings from Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-800 font-semibold mb-2">Connection Error</p>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-gray-500 mt-4">
            Check: <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> has correct keys
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HomeIcon /> Flatshare Naija
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">Post Ad</a>
              <a href="#" className="hover:underline">How it Works</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rooms, flats, hostels..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Available Flatshares</h2>
          <p className="text-gray-600">{filtered.length} listings</p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No listings found. Try adjusting your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(l => (
              <div key={l.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition">
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{l.title}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{l.price}<span className="text-sm text-gray-500">/month</span></p>
                  <p className="text-gray-600 flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4" /> {l.location}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {l.beds} bed</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {l.occupants} sharing</span>
                  </div>
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Flatshare Naija. Powered by Supabase.</p>
        </div>
      </footer>
    </>
  );
}

function HomeIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
