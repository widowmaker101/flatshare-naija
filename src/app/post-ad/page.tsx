'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostAd() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('');
  const [occupants, setOccupants] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('listings').insert({
      title,
      price: `₦${price}`,
      location,
      beds: parseInt(beds),
      occupants: parseInt(occupants),
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Ad posted!');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Ad</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto space-y-4">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
        <input placeholder="Price (e.g. 50000)" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
        <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required>
          <option value="">Select Location</option>
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Port Harcourt</option>
        </select>
        <input type="number" placeholder="Beds" value={beds} onChange={e => setBeds(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
        <input type="number" placeholder="Occupants" value={occupants} onChange={e => setOccupants(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          Post Ad
        </button>
      </form>
    </div>
  );
}
