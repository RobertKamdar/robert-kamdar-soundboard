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
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 16px',
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.72)), url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white'
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto 32px',
            padding: 'clamp(20px, 4vw, 36px)',
            background: 'rgba(10, 10, 10, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)'
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#ff4d4d',
              fontSize: 14,
              letterSpacing: 3,
              textTransform: 'uppercase'
            }}
          >
            Robert Kamdar
          </p>

          <h1
            style={{
              margin: '14px 0 20px',
              color: 'white',
              fontSize: 'clamp(28px, 6vw, 42px)',
              lineHeight: 1.1
            }}
          >
            The Producer
          </h1>

          <p
            style={{
              margin: '0 0 18px',
              color: 'white',
              fontSize: 'clamp(16px, 2.8vw, 18px)',
              lineHeight: 1.8
            }}
          >
            Welcome — I’m Robert Kamdar, The Producer.
          </p>

          <p
            style={{
              margin: '0 0 18px',
              color: 'rgba(255, 255, 255, 0.96)',
              fontSize: 'clamp(15px, 2.6vw, 17px)',
              lineHeight: 1.85
            }}
          >
            I specialise in drill, creating hard-hitting, distinctive beats rooted in
            the energy of the UK scene while pushing the sound in new directions. My
            inspiration comes from rap music across the globe, drawing from different
            cultures, rhythms, and styles to shape instrumentals that feel fresh,
            original, and internationally influenced.
          </p>

          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.96)',
              fontSize: 'clamp(15px, 2.6vw, 17px)',
              lineHeight: 1.85
            }}
          >
            While drill is my foundation, I also explore a wide range of sounds and
            genres, bringing versatility, creativity, and a unique perspective to
            every track I produce.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            maxWidth: 720,
            margin: '0 auto'
          }}
        >
          {beats.map((beat) => {
            const isPlaying = currentFile === beat.file

            return (
              <button
                key={beat.name}
                onClick={() => handleBeatClick(beat)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: isPlaying ? '#c40000' : 'rgba(15, 15, 15, 0.88)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 14,
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  boxShadow: isPlaying
                    ? '0 10px 30px rgba(196, 0, 0, 0.35)'
                    : '0 8px 24px rgba(0, 0, 0, 0.22)'
                }}
              >
                {beat.name}
              </button>
            )
          })}
        </div>

        <p
          style={{
            marginTop: 28,
            color: '#ff4d4d',
            fontSize: 'clamp(14px, 2.5vw, 16px)'
          }}
        >
          Now Playing: {nowPlaying}
        </p>
      </div>
    </div>
  )
}
