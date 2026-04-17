import { useRef, useState } from 'react'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')
  const [currentFile, setCurrentFile] = useState(null)
  const audioRef = useRef(null)

  const beats = [
  { name: 'NFS', file: '/nfs.mp3' },
  { name: 'SAYONARA', file: '/sayonara.mp3' }
]


  const handleBeatClick = (beat) => {
    if (audioRef.current && currentFile === beat.file) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      setCurrentFile(null)
      setNowPlaying('None')
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(beat.file)
    audioRef.current = audio
    setCurrentFile(beat.file)
    setNowPlaying(beat.name)

    audio.onended = () => {
      audioRef.current = null
      setCurrentFile(null)
      setNowPlaying('None')
    }

    audio.play().catch(() => {
      audioRef.current = null
      setCurrentFile(null)
      setNowPlaying('None')
    })
  }

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ color: 'red', fontSize: 32 }}>
        Robert Kamdar, The Producer
      </h1>

      <div style={{ marginTop: 20 }}>
        {beats.map((beat) => {
          const isPlaying = currentFile === beat.file

          return (
            <button
              key={beat.name}
              onClick={() => handleBeatClick(beat)}
              style={{
                padding: 18,
                background: isPlaying ? 'red' : '#111',
                border: '1px solid red',
                color: 'white',
                cursor: 'pointer',
                display: 'block',
                marginBottom: 10
              }}
            >
              {isPlaying ? `Pause ${beat.name}` : `Play ${beat.name}`}
            </button>
          )
        })}
      </div>

      <p style={{ marginTop: 30, color: 'red' }}>
        Now Playing: {nowPlaying}
      </p>
    </div>
  )
}
