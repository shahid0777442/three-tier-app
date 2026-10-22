import { useEffect, useState } from 'react';

const API = 'http://34.207.209.171:5000/api/entries';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch(API);
      setEntries(await res.json());
    } catch {
      setError('Cannot reach the server. Is the API running on port 5000?');
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, notes }),
    });
    setTitle(''); setNotes('');
    load();
  };

  const toggle = async (entry) => {
    await fetch(`${API}/${entry._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !entry.done }),
    });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <main>
      <h1>Lab Notebook</h1>
      <p className="sub">Log experiments and mark them complete.</p>

      <form onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Experiment title" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows="3" />
        <button type="submit">Add entry</button>
      </form>

      {error && <p className="error">{error}</p>}
      {!error && entries.length === 0 && <p className="empty">No entries yet. Add your first experiment above.</p>}

      <ul>
        {entries.map((en) => (
          <li key={en._id} className={en.done ? 'done' : ''}>
            <div>
              <strong>{en.title}</strong>
              {en.notes && <p>{en.notes}</p>}
              <small>{new Date(en.createdAt).toLocaleString()}</small>
            </div>
            <div className="actions">
              <button onClick={() => toggle(en)}>{en.done ? 'Reopen' : 'Mark done'}</button>
              <button className="danger" onClick={() => remove(en._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
