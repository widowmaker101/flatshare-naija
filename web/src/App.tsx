import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Home, UserPlus, LogIn } from 'lucide-react';
import './index.css';

function App() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(r => { setRooms(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(r => 
    !city || r.city.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-7 h-7" />
            <h1 className="text-2xl font-bold">FlatShare Naija</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
              <Search className="w-5 h-5" />
              <input
                placeholder="Lagos, Abuja..."
                className="bg-transparent border-0 outline-none text-white placeholder-gray-200 w-40"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition">
              <LogIn className="w-5 h-5" /> Login
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-green-700 hover:bg-gray-100 transition">
              <UserPlus className="w-5 h-5" /> Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600 py-16">No rooms in <strong>{city || 'your area'}</strong>. Try another city!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(room => (
              <div key={room._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Room Image</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{room.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description || 'Great shared flat!'}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    {room.city}, {room.state}
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-4">
                    ₦{room.price?.toLocaleString()}/mo
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium">
                    Message Owner
                  </button>
                  {room.owner && (
                    <p className="text-xs text-gray-500 text-center mt-3">by {room.owner.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-green-800 text-white text-center py-5 mt-16">
        <p>© 2025 FlatShare Naija • Built in Nigeria</p>
      </footer>
    </div>
  );
}

export default App;
