import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')
  const [currentFile, setCurrentFile] = useState(null)
  const [selectedBpm, setSelectedBpm] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  const [hoveredCard, setHoveredCard] = useState('')
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const playbackIdRef = useRef(0)

  const beats = [
    { name: 'N.F.S', file: '/nfs.mp3', bpm: '143', moods: ['Ethnic', 'Chaotic', 'Gritty'] },
    { name: 'SAYONARA', file: '/sayonara.mp3', bpm: '142', moods: ['Melodic', 'Producer Favourite', 'Atmospheric', 'Ethnic'] },
    { name: 'TYPICAL', file: '/typical.mp3', bpm: '140', moods: ['Melodic', 'Dark', 'Used for Battle', 'Producer Favourite'] },
    { name: 'BUILT DIFFERENT', file: '/builtdifferent.mp3', bpm: '143', moods: ['Dark', 'Used for Battle', 'Aggressive', 'Jumpy', 'Producer Favourite', 'Gritty']
    },
    { name: 'CZARS & EMIRS', file: '/czarsandemirs.mp3', bpm: '142', moods: ['Ethnic', 'Gritty'] },
    { name: 'HK', file: '/hk.mp3', bpm: '143', moods: ['Dark', 'Mellow', 'Dramatic'] },
    { name: 'KNOWN', file: '/known.mp3', bpm: '100', moods: ['Hip Hop', 'Gritty', 'Minimalistic'] },
    { name: 'LUCID', file: '/lucid.mp3', bpm: '143', moods: ['Melodic', 'Hybrid', 'Mellow', 'Dubstep'] },
    { name: 'RUDE', file: '/rude.mp3', bpm: '143', moods: ['Aggressive', 'Gritty', 'Hybrid'] },
    { name: 'OLYMPUS', file: '/olympus.mp3', bpm: '146', moods: ['Aggressive', 'Dramatic', 'Hybrid'] },
    { name: 'COLLISION COURSE', file: '/collisioncourse.mp3', bpm: '144', moods: ['Aggressive', 'Chaotic', 'Jumpy', 'Ethnic'] },
    { name: 'DOWNLOAD', file: '/download.mp3', bpm: '143', moods: ['Melodic', 'Upbeat', 'Hybrid'] },
    { name: 'WRATH', file: '/wrath.mp3', bpm: '144', moods: ['Minimalistic', 'Angry', 'Gritty', 'Eerie'] },
    { name: 'HIGHEST', file: '/highest.mp3', bpm: '144', moods: ['Eerie', 'Dark', 'Atmospheric', 'Minimalistic', 'Gritty' ] },
    { name: 'INSANE', file: '/insane.mp3', bpm: '143', moods: ['Eerie', 'Gritty', 'Dramatic'] },
    { name: 'HOODED UP', file: '/hoodedup.mp3', bpm: '144', moods: ['Aggressive', 'Gritty', 'Hybrid', 'Dramatic'] },
    { name: 'PUNCHLINE', file: '/punchline.mp3', bpm: '146', moods: ['Hybrid', 'Jumpy', 'Wavy'] },
    { name: 'ZYWIOL', file: '/zywiol.mp3', bpm: '143', moods: ['Wavy', 'Upbeat'] },
    { name: 'ANKARA', file: '/ankara.mp3', bpm: '142', moods: ['Ethnic', 'Jumpy', 'Dark'] },
    { name: 'CAUSE', file: '/cause.mp3', bpm: '144', moods: ['Melodic', 'Wavy', 'Producer Favourite', 'Upbeat'] },
    { name: 'CONFLICT', file: '/conflict.mp3', bpm: '144', moods: ['Dark', 'Producer Favourite', 'Mellow', 'Jumpy'] },
    { name: 'CRASHOUT', file: '/crashout.mp3', bpm: '150', moods: ['Hybrid', 'Aggressive', 'Gritty', 'Violent', 'Hip Hop'] },
    { name: 'DERRY', file: '/derry.mp3', bpm: '143', moods: ['Dark', 'Violent', 'Gritty'] },
    { name: 'JOHTO', file: '/johto.mp3', bpm: '150', moods: ['Upbeat', 'Hybrid', 'Retro'] },
    { name: 'MONSOON', file: '/monsoon.mp3', bpm: '140', moods: ['Dark', 'Gritty', 'Eerie'] },
    { name: 'MORTIFY', file: '/mortify.mp3', bpm: '141', moods: ['Dark', 'Dramatic', 'Eerie'] },
    { name: 'PERSIAN', file: '/persian.mp3', bpm: '141', moods: ['Ethnic', 'Aggressive', 'Minimalistic'] },
    { name: 'PREMIUM', file: '/premium.mp3', bpm: '150', moods: ['Hybrid', 'Producer Favourite', 'Hip Hop'] },
    { name: 'QOTD', file: '/qotd.mp3', bpm: '143', moods: ['Eerie', 'Mellow', 'Ethnic', 'Dark'] },
    { name: 'SHIFTING', file: '/shifting.mp3', bpm: '142', moods: ['Aggressive' 'Gritty', 'Minimalistic'] },
    {
      name: 'STEREO TYPICAL',
      file: '/stereotypical.mp3',
      bpm: '142',
      moods: ['Eerie', 'Dubstep', 'Dark', 'Atmospheric', 'Melodic']
    },
    { name: 'TPW', file: '/tpw.mp3', bpm: '145', moods: ['Ethnic', 'Jumpy', 'Dark'] },
    { name: 'BELKI', file: '/belki.mp3', bpm: '145', moods: ['Ethnic', 'Grimy', 'Minimalistic', 'Producer Favourite', 'Aggressive']
    },
    { name: 'KITE', file: '/kite.mp3', bpm: '145', moods: ['Ethnic', 'Eerie', 'Mellow', 'Dark'] },
    { name: 'FRANKFURT', file: '/frankfurt.mp3', bpm: '144', moods: ['Ethnic', 'Eerie'. 'Minimalistic', 'Dark'] },
    { name: 'SKITZ', file: '/skitz.mp3', bpm: '145', moods: ['Aggressive', 'Chaotic', 'Jumpy', 'Wavy'] },
    { name: 'RAGEQUIT', file: '/ragequit.mp3', bpm: '145', moods: ['Grimy', 'Angry', 'Gritty', 'Retro'] },
    { name: 'DAI', file: '/dai.mp3', bpm: '143', moods: ['Dubstep', 'Hybrid', 'Mellow', 'Melodic'] },
    { name: 'FINISHED', file: '/finished.mp3', bpm: '144', moods: ['Dark', 'Gritty', 'Eerie', 'Ethnic'] },
    { name: 'TRIDENT', file: '/trident.mp3', bpm: '143', moods: ['Dramatic', 'Atmospheric', 'Mellow', 'Dark', 'Melodic'] },
    {
      name: 'THE GAME',
      file: '/thegame.mp3',
      bpm: '150',
      moods: ['Hybrid', 'Aggressive', 'Hip Hop', 'Retro']
    },
    { name: 'NOTORIETY', file: '/notoriety.mp3', bpm: '143', moods: ['Eerie', 'Jumpy', 'Minimalistic'] },
    {
      name: 'SUBZERO',
      file: '/subzero.mp3',
      bpm: '144',
      moods: ['Aggressive', 'Atmospheric', 'Producer Favourite']
    },
    { name: 'CUBE', file: '/cube.mp3', bpm: '146', moods: ['Retro', 'Hybrid'] },
    { name: 'OMEN', file: '/omen.mp3', bpm: '145', moods: ['Dramatic', 'Gritty', 'Eerie'] },
    { name: 'WINTERS', file: '/winters.mp3', bpm: '145', moods: ['Eerie', 'Atmospheric', 'Dramatic'] },
    {
      name: 'FAMILY TREE',
      file: '/familytree.mp3',
      bpm: '147',
      moods: ['Dramatic', 'Mellow', 'Insightful', 'Hip Hop']
    },
    {
      name: 'CHURCH', file: '/church.mp3', bpm: '144', moods: ['Dramatic', 'Grimy', 'Gritty', 'Aggressive']
    },
    { name: 'L1TNESS', file: '/l1tness.mp3', bpm: '143', moods: ['Grimy', 'Used for Battle', 'Wavy', 'Jumpy', 'Minimalistic'] },
    { name: 'F4TALITY', file: '/f4tality.mp3', bpm: '143', moods: ['Dramatic', 'Used for Battle', 'Dark', 'Gritty'] }
  ]

  const sortedBeats = [...beats].sort((a, b) => a.name.localeCompare(b.name))

  const bpmOptions = [...new Set(sortedBeats.map((beat) => beat.bpm).filter(Boolean))].sort(
    (a, b) => Number(a) - Number(b)
  )

  const moodOptions = [...new Set(sortedBeats.flatMap((beat) => beat.moods || []))].sort()

  const filteredBeats = sortedBeats.filter((beat) => {
    const matchesBpm = selectedBpm === '' || beat.bpm === selectedBpm
    const matchesMood = selectedMood === '' || beat.moods.includes(selectedMood)
    return matchesBpm && matchesMood
  })

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resetPlayer = () => {
    playbackIdRef.current += 1
    clearTimer()

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioRef.current = null
    setCurrentFile(null)
    setNowPlaying('None')
    setElapsed(0)
    setDuration(0)
  }

  const handleBeatClick = (beat) => {
    if (audioRef.current && currentFile === beat.file) {
      resetPlayer()
      return
    }

    playbackIdRef.current += 1
    const playbackId = playbackIdRef.current

    clearTimer()

    const audio = audioRef.current || new Audio()
    audio.pause()
    audio.src = beat.file
    audio.currentTime = 0
    audio.preload = 'auto'

    audioRef.current = audio
    setCurrentFile(beat.file)
    setNowPlaying(beat.name)
    setElapsed(0)
    setDuration(0)

    audio.onloadedmetadata = () => {
      if (playbackId === playbackIdRef.current) {
        setDuration(audio.duration)
      }
    }

    audio.onended = () => {
      if (playbackId === playbackIdRef.current) {
        resetPlayer()
      }
    }

    audio.load()

    audio.play().catch(() => {
      if (playbackId === playbackIdRef.current) {
        resetPlayer()
      }
    })

    intervalRef.current = setInterval(() => {
      if (audioRef.current && playbackId === playbackIdRef.current) {
        setElapsed(audioRef.current.currentTime)
      }
    }, 500)
  }

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value)

    if (!audioRef.current || !duration) return

    audioRef.current.currentTime = nextTime
    setElapsed(nextTime)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimer()
      window.removeEventListener('resize', handleResize)

      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const sideCardStyle = {
    background: 'rgba(38, 38, 38, 0.94)',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    borderRadius: 22,
    padding: '16px 14px',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    textAlign: 'center'
  }

  const contactLinkStyle = (id) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 10px',
    borderRadius: 14,
    background:
      hoveredCard === id
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.04)',
    color: 'white',
    textDecoration: 'none',
    border:
      hoveredCard === id
        ? '1px solid rgba(255, 77, 77, 0.35)'
        : '1px solid rgba(255, 255, 255, 0.08)',
    transform: hoveredCard === id ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow:
      hoveredCard === id
        ? '0 10px 20px rgba(0, 0, 0, 0.22)'
        : 'none',
    transition: 'all 160ms ease'
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 16px 135px',
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
        <div
          style={{
            flex: '0 0 214px',
            width: 214,
            maxWidth: '100%',
            display: 'grid',
            gap: 14,
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? 'auto' : 24,
            alignSelf: isMobile ? 'auto' : 'flex-start'
          }}
        >
          <aside style={sideCardStyle}>
            <p
              style={{
                margin: '0 0 14px',
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
              onMouseEnter={() => setHoveredCard('email')}
              onMouseLeave={() => setHoveredCard('')}
              style={{ ...contactLinkStyle('email'), marginBottom: 10 }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                E-mail me
              </span>
            </a>

            <a
              href="https://instagram.com/robertkamdarmusic"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHoveredCard('insta')}
              onMouseLeave={() => setHoveredCard('')}
              style={contactLinkStyle('insta')}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                Reach me on Instagram
              </span>
            </a>
          </aside>

          {!isMobile && (
            <aside style={sideCardStyle}>
              <p
                style={{
                  margin: '0 0 12px',
                  color: '#d7d7d7',
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: 'uppercase'
                }}
              >
                Previous Credit(s)
              </p>

              <p
                style={{
                  margin: '0 0 12px',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1.35
                }}
              >
                Drizz GB Round 2 vs Anbu Senseii
              </p>

              <a
                href="https://open.spotify.com/track/25Kv09CJz0LkRyxrkn89Ts"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHoveredCard('credit')}
                onMouseLeave={() => setHoveredCard('')}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 170,
                  height: 170,
                  borderRadius: 18,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow:
                    hoveredCard === 'credit'
                      ? '0 18px 34px rgba(0, 0, 0, 0.38)'
                      : '0 14px 28px rgba(0, 0, 0, 0.3)',
                  transform: hoveredCard === 'credit' ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 180ms ease'
                }}
              >
                <img
                  src="/anbu.jpg"
                  alt="Drizz GB Round 2 vs Anbu Senseii artwork"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(0.82)',
                    transform: hoveredCard === 'credit' ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 180ms ease'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    width: 54,
                    height: 54,
                    borderRadius: 999,
                    background: 'rgba(196, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginLeft: 3,
                      lineHeight: 1
                    }}
                  >
                    ▶
                  </span>
                </span>
              </a>

              <p
                style={{
                  margin: '12px 0 0',
                  color: 'rgba(255, 255, 255, 0.72)',
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                0:00 / 1:26
              </p>
            </aside>
          )}
        </div>

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
              Welcome - I&apos;m Robert Kamdar, The Producer.
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

          <p
            style={{
              margin: '0 auto 14px',
              maxWidth: 420,
              color: 'rgba(255, 255, 255, 0.88)',
              fontSize: 'clamp(13px, 2.2vw, 15px)',
              lineHeight: 1.6,
              textAlign: 'center'
            }}
          >
            Preview my beats here, you can filter through instrumentals by BPM and moods.
          </p>

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
              gridTemplateColumns: isMobile
                ? 'repeat(4, minmax(0, 1fr))'
                : 'repeat(6, minmax(0, 1fr))',
              gap: 8,
              maxWidth: isMobile ? 560 : 900,
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
            padding: '12px 18px 14px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '140px minmax(160px, 1fr) 125px',
            alignItems: 'center',
            gap: isMobile ? 8 : 16
          }}
        >
          <span
            style={{
              color: '#ff4d4d',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            Now Playing
          </span>

          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                color: 'white',
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                marginBottom: nowPlaying === 'None' ? 0 : 8
              }}
            >
              {nowPlaying}
            </span>

            {nowPlaying !== 'None' && (
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(elapsed, duration || 0)}
                onChange={handleSeek}
                aria-label="Skip through current beat"
                style={{
                  width: '100%',
                  accentColor: '#ff2a2a',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-end',
              gap: 12
            }}
          >
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
    </div>
  )
}
