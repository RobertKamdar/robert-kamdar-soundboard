import { useState } from 'react'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')

const beats = [
  { name: "NFS", file: "/nfs.mp3" }
]
  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: 'red', fontSize: 32 }}>
        Robert Kamdar, The Producer
      </h1>

      <p style={{ opacity: 0.7, marginTop: 10 }}>
        Click a beat to preview
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 10,
          marginTop: 20
        }}
      >
        {beats.map((b) => (
          <button
            key={b}
            onClick={() => setNowPlaying(b)}
            style={{
              padding: 18,
              background: '#111',
              border: '1px solid red',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {b}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 30, color: 'red' }}>
        Now Playing: {nowPlaying}
      </p>
    </div>
  )
}
