import { useRef, useState, useEffect } from 'react'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')
  const [currentFile, setCurrentFile] = useState(null)
  const [selectedBpm, setSelectedBpm] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  const beats = [
    {
      name: 'N.F.S',
      file: '/nfs.mp3',
      bpm: '143',
      moods: ['Ethnic']
    },
    {
      name: 'SAYONARA',
      file: '/sayonara.mp3',
      bpm: '142',
      moods: ['Melodic', 'Ethnic']
    },
    {
      name: 'TYPICAL',
      file: '/typical.mp3',
      bpm: '140',
      moods: ['Melodic', 'Dark', 'Producer Favourite']
    },
    {
      name: 'BUILT DIFFERENT',
      file: '/builtdifferent.mp3',
      bpm: '143',
      moods: ['Dark', 'Aggressive', 'Producer Favourite']
    },
    {
      name: 'CZARS & EMIRS',
      file: '/czarsandemirs.mp3',
      bpm: '142',
      moods: ['Ethnic']
    },
    {
      name: 'HK',
      file: '/hk.mp3',
      bpm: '143',
      moods: ['Dark']
    },
    {
      name: 'KNOWN',
      file: '/known.mp3',
      bpm: '100',
      moods: ['Hip Hop']
    },
    {
      name: 'LUCID',
      file: '/lucid.mp3',
      bpm: '143',
      moods: ['Melodic', 'Dubstep']
    },
    {
      name: 'RUDE',
      file: '/rude.mp3',
      bpm: '143',
      moods: ['Aggressive', 'Dark']
    },
    {
      name: 'ANKARA',
      file: '/ankara.mp3',
      bpm: '142',
      moods: ['Ethnic', 'Dark']
    },
    {
      name: 'CAUSE',
      file: '/cause.mp3',
      bpm: '144',
      moods: ['Melodic', 'Upbeat']
    },
    {
      name: 'CONFLICT',
      file: '/conflict.mp3',
      bpm: '144',
      moods: ['Dark']
    },
    {
      name: 'CRASHOUT',
      file: '/crashout.mp3',
      bpm: '150',
      moods: ['Hybrid', 'Aggressive', 'Hip Hop']
    },
    {
      name: 'DERRY',
      file: '/derry.mp3',
      bpm: '143',
      moods: ['Dark', 'Gritty']
    },
    {
      name: 'JOHTO',
      file: '/johto.mp3',
      bpm: '150',
      moods: ['Upbeat', 'Hybrid', 'Retro']
    },
    {
      name: 'MONSOON',
      file: '/monsoon.mp3',
      bpm: '140',
      moods: ['Dark', 'Eerie']
    },
    {
      name: 'MORTIFY',
      file: '/mortify.mp3',
      bpm: '141',
      moods: ['Dark', 'Eerie']
    },
    {
      name: 'PERSIAN',
      file: '/persian.mp3',
      bpm: '141',
      moods: ['Ethnic', 'Aggressive']
    },
    {
      name: 'PREMIUM',
      file: '/premium.mp3',
      bpm: '150',
      moods: ['Hybrid', 'Hip Hop']
    },
    {
      name: 'QOTD',
      file: '/qotd.mp3',
      bpm: '143',
      moods: ['Eerie', 'Ethnic', 'Dark']
    },
    {
      name: 'SHIFTING',
      file: '/shifting.mp3',
      bpm: '142',
      moods: ['Aggressive']
    },
    {
      name: 'STEREO TYPICAL',
      file: '/stereotypical.mp3',
      bpm: '142',
      moods: ['Eerie', 'Dubstep', 'Dark', 'Melodic']
    },
    {
      name: 'TPW',
      file: '/tpw.mp3',
      bpm: '145',
      moods: ['Ethnic', 'Dark']
    },
    {
      name: 'BELKI',
      file: '/belki.mp3',
      bpm: '145',
      moods: ['Ethnic', 'Grimy', 'Producer Favourite', 'Aggressive']
    },
    {
      name: 'KITE',
      file: '/kite.mp3',
      bpm: '145',
      moods: ['Ethnic', 'Eerie', 'Dark']
    },
    {
      name: 'FRANKFURT',
      file: '/frankfurt.mp3',
      bpm: '144',
      moods: ['Ethnic', 'Dark']
    },
    {
      name: 'SKITZ',
      file: '/skitz.mp3',
      bpm: '145',
      moods: ['Aggressive', 'Chaotic', 'Wavy']
    },
    {
      name: 'RAGEQUIT',
      file: '/ragequit.mp3',
      bpm: '145',
      moods: ['Grimy', 'Retro']
    },
    {
      name: 'DAI',
      file: '/dai.mp3',
      bpm: '143',
      moods: ['Dubstep', 'Melodic']
    },
    {
      name: 'FINISHED',
      file: '/finished.mp3',
      bpm: '144',
      moods: ['Dark', 'Eerie', 'Ethnic']
    },
    {
      name: 'TRIDENT',
      file: '/trident.mp3',
      bpm: '143',
      moods: ['Dramatic', 'Dark', 'Melodic']
    },
    {
      name: 'THE GAME',
      file: '/thegame.mp3',
      bpm: '150',
      moods: ['Hybrid', 'Aggressive', 'Hip Hop', 'Retro']
    },
    {
      name: 'NOTORIETY',
      file: '/notoreity.mp3',
      bpm: '143',
      moods: ['Eerie', 'Minimalistic']
    },
    {
      name: 'SUBZERO',
      file: '/subzero.mp3',
      bpm: '144',
      moods: ['Aggressive', 'Producer Favourite']
    },
    {
      name: 'CUBE',
      file: '/cube.mp3',
      bpm: '146',
      moods: ['Retro', 'Hybrid']
    },
    {
      name: 'OMEN',
      file: '/omen.mp3',
      bpm: '145',
      moods: ['Dramatic', 'Eerie']
    },
    {
      name: 'SLASHER',
      file: '/slasher.mp3',
      bpm: '143',
      moods: ['Dramatic', 'Aggressive']
    }
  ]

  const sortedBeats = [...beats].sort((a, b) => a.name.localeCompare(b.name))

  const bpmOptions = [...new Set(sortedBeats.filter((b) => b.bpm).map((beat) => beat.bpm))].sort(
    (a, b) => Number(a) - Number(b)
  )

  const moodOptions = [...new Set(sortedBeats.filter((b) => b.moods).flatMap((beat) => beat.moods))].sort()

  const filteredBeats = sortedBeats.filter((beat) => {
    const matchesBpm = selectedBpm === '' || beat.bpm === selectedBpm
    const matchesMood =
      selectedMood === '' || (beat.moods && beat.moods.includes(selectedMood))

    return matchesBpm && matchesMood
  })

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleBeatClick = (beat) => {
    if (audioRef.current && currentFile === beat.file) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      clearTimer()
      setCurrentFile(null)
      setNowPlaying('None')
      setElapsed(0)
      setDuration(0)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      clearTimer()
    }

    const audio = new Audio(beat.file)
    audioRef.current = audio
    setCurrentFile(beat.file)
    setNowPlaying(beat.name)
    setElapsed(0)
    setDuration(0)

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.onended = () => {
      audioRef.current = null
      clearTimer()
      setCurrentFile(null)
      setNowPlaying('None')
      setElapsed(0)
      setDuration(0)
    }

    audio.play().catch(() => {
      audioRef.current = null
      clearTimer()
      setCurrentFile(null)
      setNowPlaying('None')
      setElapsed(0)
      setDuration(0)
    })

    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setElapsed(audioRef.current.currentTime)
      }
    }, 500)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 16px 110px',
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
          maxWidth: 1320,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 24
        }}
      >
        <aside
          style={{
            flex: '0 0 230px',
            width: 230,
            maxWidth: '100%',
            background: 'rgba(38, 38, 38, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 22,
            padding: '20px 18px',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              margin: '0 0 16px',
              color: '#d7d7d7',
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}
          >
            Contact Me
          </p>

          <a
            href="mailto:robertkamdar.rkrk@gmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 10px',
              marginBottom: 10,
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'white',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <img
              src="/email.png"
              alt="Email"
              style={{
                width: 18,
                height: 18,
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              E-mail me
            </span>
          </a>

          <a
            href="https://instagram.com/robertkamdarmusic"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 10px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'white',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <img
              src="/insta.png"
              alt="Instagram"
              style={{
                width: 18,
                height: 18,
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              Reach me on Instagram
            </span>
          </a>
        </aside>

        <div
          style={{
            flex: '1 1 900px',
            minWidth: 0,
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
              Welcome - I'm Robert Kamdar, The Producer.
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
              gridTemplateColumns: 'minmax(0, 120px) minmax(0, 140px)',
              justifyContent: 'center',
              gap: 10,
              maxWidth: 280,
              margin: '0 auto 20px'
            }}
          >
            <select
              value={selectedBpm}
              onChange={(event) => setSelectedBpm(event.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 999,
                border: '1px solid #9a9a9a',
                background: '#2f2f2f',
                color: 'white',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)'
              }}
            >
              <option value="">BPM</option>
              {bpmOptions.map((bpm) => (
                <option key={bpm} value={bpm}>
                  {bpm}
                </option>
              ))}
            </select>

            <select
              value={selectedMood}
              onChange={(event) => setSelectedMood(event.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 999,
                border: '1px solid #9a9a9a',
                background: '#2f2f2f',
                color: 'white',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)'
              }}
            >
              <option value="">Mood</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 8,
              maxWidth: 560,
              margin: '0 auto'
            }}
          >
            {filteredBeats.map((beat) => {
              const isPlaying = currentFile === beat.file

              return (
                <button
                  key={beat.name}
                  onClick={() => handleBeatClick(beat)}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    background: isPlaying ? '#c40000' : 'rgba(15, 15, 15, 0.88)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: 14,
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 'clamp(9px, 2.6vw, 11px)',
                    fontWeight: 600,
                    letterSpacing: 0.1,
                    lineHeight: 1.15,
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    whiteSpace: 'normal',
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
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(45,0,0,0.98) 50%, rgba(0,0,0,0.97) 100%)',
          borderTop: '2px solid #c40000',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.45)'
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16
          }}
        >
          <span
            style={{
              color: '#ff4d4d',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
          >
            Now Playing
          </span>

          <span
            style={{
              color: 'white',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              textAlign: 'center'
            }}
          >
            {nowPlaying}
          </span>

          {nowPlaying !== 'None' && (
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {formatTime(elapsed)} / {formatTime(duration)}
            </span>
          )}

          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              flexShrink: 0,
              background: nowPlaying === 'None' ? '#666' : '#ff2a2a',
              boxShadow:
                nowPlaying === 'None'
                  ? 'none'
                  : '0 0 12px rgba(255, 42, 42, 0.9)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
