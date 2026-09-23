'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Enregistrer un objet
  const handleSave = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessage('');

    try {
      const parts = input.split('dans');
      const item = parts[0]?.trim() || input;
      const location = parts[1]?.trim() || 'Emplacement non précisé';

      const { error } = await supabase.from('objects').insert([
        {
          raw_text: input,
          item_name: item,
          location: location,
        },
      ]);

      if (error) throw error;
      setMessage('Objet enregistré avec succès !');
      setInput('');
    } catch (err: any) {
      setMessage(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Rechercher un objet
  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .ilike('item_name', `%${search}%`);

    if (!error && data) {
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>📌 MemoSpot</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Ton second cerveau pour ne plus jamais rien perdre.</p>

      {/* Enregistrement */}
      <section style={{ marginTop: '30px', background: '#f5f5f5', padding: '15px', borderRadius: '10px' }}>
        <h3>Mémoriser un objet</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Mes clés dans le tiroir du bureau"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Enregistrement...' : 'Mémoriser'}
        </button>
        {message && <p style={{ fontSize: '0.9rem', color: message.includes('Erreur') ? 'red' : 'green' }}>{message}</p>}
      </section>

      {/* Recherche */}
      <section style={{ marginTop: '30px', background: '#f5f5f5', padding: '15px', borderRadius: '10px' }}>
        <h3>Retrouver un objet</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: Clés"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>

        <div style={{ marginTop: '15px' }}>
          {results.map((obj) => (
            <div key={obj.id} style={{ background: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '8px', borderLeft: '4px solid #10b981' }}>
              <strong>{obj.item_name}</strong>
              <p style={{ margin: '4px 0 0 0', color: '#555' }}>📍 {obj.location}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
