import { useState } from 'react'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')

  const beats = [
    { name: "NFS", file: "/nfs.mp3" }
  ]

  const playBeat = (beat) => {
    const audio = new Audio(beat.file)
    audio.play()
    setNowPlaying(beat.name)
  }

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: 'red', fontSize: 32 }}>
        Robert Kamdar, The Producer
      </h1>

      <div style={{ marginTop: 20 }}>
        {beats.map((b) => (
          <button
            key={b.name}
            onClick={() => playBeat(b)}
            style={{
              padding: 18,
              background: '#111',
              border: '1px solid red',
              color: 'white',
              cursor: 'pointer',
              display: 'block',
              marginBottom: 10
            }}
          >
            {b.name}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 30, color: 'red' }}>
        Now Playing: {nowPlaying}
      </p>
    </div>
  )
}
