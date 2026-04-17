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
        padding: '48px 24px',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.
