```jsx
import { useEffect, useRef, useState } from 'react'

function CustomSelect({ value, onChange, options, placeholder, multiple = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredOption, setHoveredOption] = useState(null)
  const [focusedOption, setFocusedOption] = useState(null)
  const wrapperRef = useRef(null)
  const optionRefs = useRef({})
  const menuClassName = 'custom-select-menu'

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768
  const selectedValues = multiple ? value : value ? [value] : []
  const keyboardOptions = multiple ? options : [{ value: '', label: placeholder }, ...options]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
        setHoveredOption(null)
        setFocusedOption(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen || isSmallScreen || focusedOption === null) return

    const optionKey = focusedOption === '' ? '__placeholder__' : focusedOption
    const activeOption = optionRefs.current[optionKey]

    if (activeOption) {
      activeOption.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedOption, isOpen, isSmallScreen])

  const selectedLabel = multiple
    ? selectedValues.length > 0
      ? `${placeholder} (${selectedValues.length})`
      : placeholder
    : options.find((option) => option.value === value)?.label || placeholder

  const getDefaultFocusValue = () => {
    if (multiple) {
      return selectedValues[0] ?? options[0]?.value ?? null
    }

    return value
  }

  const getCurrentIndex = () => {
    const currentValue = focusedOption !== null ? focusedOption : getDefaultFocusValue()
    const currentIndex = keyboardOptions.findIndex((option) => option.value === currentValue)
    return currentIndex >= 0 ? currentIndex : 0
  }

  const toggleOption = (optionValue) => {
    if (!multiple) {
      onChange(optionValue)
      setIsOpen(false)
      setHoveredOption(null)
      setFocusedOption(null)
      return
    }

    onChange(
      selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue]
    )
    setHoveredOption(optionValue)
    setFocusedOption(optionValue)
  }

  const handleKeyDown = (event) => {
    if (isSmallScreen) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (!isOpen) {
        setIsOpen(true)
        setFocusedOption(getDefaultFocusValue())
        return
      }

      const currentIndex = getCurrentIndex()
      const nextIndex =
        currentIndex < keyboardOptions.length - 1 ? currentIndex + 1 : currentIndex

      setFocusedOption(keyboardOptions[nextIndex].value)
      setHoveredOption(null)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      if (!isOpen) {
        setIsOpen(true)
        setFocusedOption(getDefaultFocusValue())
        return
      }

      const currentIndex = getCurrentIndex()
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0

      setFocusedOption(keyboardOptions[nextIndex].value)
      setHoveredOption(null)
    }

    if (event.key === 'Enter') {
      if (!isOpen || focusedOption === null) return

      event.preventDefault()
      toggleOption(focusedOption)
    }

    if (event.key === 'Escape') {
      if (!isOpen) return

      event.preventDefault()
      setIsOpen(false)
      setHoveredOption(null)
      setFocusedOption(null)
    }
  }

  const optionButtonStyle = (optionValue, isSelected) => ({
    width: '100%',
    minHeight: isSmallScreen ? 34 : 41,
    padding: isSmallScreen ? '9px 14px' : '12px 14px',
    border: 'none',
    background:
      hoveredOption === optionValue || focusedOption === optionValue
        ? '#c40000'
        : isSelected
          ? 'rgba(196, 0, 0, 0.18)'
          : '#2f2f2f',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 13
  })

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          .${menuClassName} {
            scrollbar-width: thin;
            scrollbar-color: #bdbdbd transparent;
          }

          .${menuClassName}::-webkit-scrollbar {
            width: 6px;
          }

          .${menuClassName}::-webkit-scrollbar-track {
            background: transparent;
          }

          .${menuClassName}::-webkit-scrollbar-thumb {
            background: #bdbdbd;
            border-radius: 999px;
          }
        `}
      </style>

      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open)
          setHoveredOption(null)
          setFocusedOption(getDefaultFocusValue())
        }}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          minHeight: 41,
          padding: '11px 42px 11px 14px',
          borderRadius: 999,
          border: isHovered ? '1px solid #c40000' : '1px solid #9a9a9a',
          background: isHovered ? '#c40000' : '#2f2f2f',
          color: 'white',
          fontSize: 13,
          textAlign: 'left',
          cursor: 'pointer',
          boxSizing: 'border-box',
          boxShadow: isHovered
            ? '0 0 0 2px rgba(196, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.22)'
            : '0 8px 24px rgba(0, 0, 0, 0.22)',
          transition: 'background 160ms ease, border-color 160ms ease, box-shadow 160ms ease'
        }}
      >
        {selectedLabel}
        <span
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
            fontSize: 12,
            lineHeight: 1,
            transition: 'transform 160ms ease',
            pointerEvents: 'none'
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className={menuClassName}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            maxHeight: 410,
            overflowY: 'auto',
            background: '#2f2f2f',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 18,
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
            zIndex: 20
          }}
        >
          {!multiple && (
            <button
              ref={(element) => {
                optionRefs.current.__placeholder__ = element
              }}
              type="button"
              onMouseEnter={() => {
                setHoveredOption('')
                setFocusedOption('')
              }}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => {
                onChange('')
                setIsOpen(false)
                setHoveredOption(null)
                setFocusedOption(null)
              }}
              style={optionButtonStyle('', value === '')}
            >
              {placeholder}
            </button>
          )}

          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value)

            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[option.value] = element
                }}
                type="button"
                onMouseEnter={() => {
                  setHoveredOption(option.value)
                  setFocusedOption(option.value)
                }}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => toggleOption(option.value)}
                style={optionButtonStyle(option.value, isSelected)}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <span>{option.label}</span>
                  <span
                    style={{
                      color: isSelected ? 'white' : 'transparent',
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1
                    }}
                  >
                    ✓
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('None')
  const [currentFile, setCurrentFile] = useState(null)
  const [selectedBpm, setSelectedBpm] = useState('')
  const [selectedMoods, setSelectedMoods] = useState([])
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  const hideSideColumn = typeof window !== 'undefined' && window.innerWidth <= 1180
  const [hoveredCard, setHoveredCard] = useState('')
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const playbackIdRef = useRef(0)

  const beats = [
    { name: 'SUSPECT', file: '/suspect.mp3', bpm: '141', moods: ['Mellow', 'Retro', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'EAGLE', file: '/eagle.mp3', bpm: '143', moods: ['Ethnic', 'Aggressive', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'AAJA', file: '/aaja.mp3', bpm: '144', moods: ['Ethnic', 'Jumpy', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'PERIL', file: '/peril.mp3', bpm: '145', moods: ['Eerie', 'Dark', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'RECKONING', file: '/reckoning.mp3', bpm: '144', moods: ['Ethnic', 'Chaotic', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'NEEKY', file: '/neeky.mp3', bpm: '143', moods: ['Mellow', 'Jumpy', 'Eerie', 'Atmospheric'], addedAt: '2026-04-18' },
    { name: 'POMPEII', file: '/pompeii.mp3', bpm: '144', moods: ['Atmospheric', 'Dark', 'Hybrid'], addedAt: '2026-04-18' },
    { name: 'HOW GREEDY', file: '/howgreedy.mp3', bpm: '145', moods: ['Aggressive', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'TSUNAMI', file: '/tsunami.mp3', bpm: '143', moods: ['Melodic', 'Dark', 'Atmospheric', 'Producer Favourite'], addedAt: '2026-04-18' },
    { name: 'BLUE LIGHTS', file: '/bluelights.mp3', bpm: '145', moods: ['Eerie', 'Mellow', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'N.F.S', file: '/nfs.mp3', bpm: '143', moods: ['Ethnic', 'Chaotic', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'SAYONARA', file: '/sayonara.mp3', bpm: '142', moods: ['Melodic', 'Oriental', 'Producer Favourite', 'Atmospheric', 'Ethnic'], addedAt: '2026-04-23' },
    { name: 'TYPICAL', file: '/typical.mp3', bpm: '140', moods: ['Melodic', 'Dark', 'Used for Battle', 'Producer Favourite'], addedAt: '2026-04-18' },
    { name: 'BUILT DIFFERENT', file: '/builtdifferent.mp3', bpm: '143', moods: ['Dark', 'Used for Battle', 'Aggressive', 'Jumpy', 'Producer Favourite', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'CZARS & EMIRS', file: '/czarsandemirs.mp3', bpm: '142', moods: ['Ethnic', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'HK', file: '/hk.mp3', bpm: '143', moods: ['Dark', 'Mellow', 'Dramatic'], addedAt: '2026-04-18' },
    { name: 'KNOWN', file: '/known.mp3', bpm: '100', moods: ['Hip Hop', 'Gritty', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'LUCID', file: '/lucid.mp3', bpm: '143', moods: ['Melodic', 'Club', 'Hybrid', 'Mellow', 'Dubstep'], addedAt: '2026-04-18' },
    { name: 'RUDE', file: '/rude.mp3', bpm: '143', moods: ['Aggressive', 'Gritty', 'Hybrid'], addedAt: '2026-04-18' },
    { name: 'OLYMPUS', file: '/olympus.mp3', bpm: '146', moods: ['Aggressive', 'Dramatic', 'Hybrid'], addedAt: '2026-04-18' },
    { name: 'COLLISION COURSE', file: '/collisioncourse.mp3', bpm: '144', moods: ['Aggressive', 'Chaotic', 'Jumpy', 'Ethnic'], addedAt: '2026-04-18' },
    { name: 'DOWNLOAD', file: '/download.mp3', bpm: '143', moods: ['Melodic', 'Upbeat', 'Hybrid'], addedAt: '2026-04-18' },
    { name: 'WRATH', file: '/wrath.mp3', bpm: '144', moods: ['Minimalistic', 'Angry', 'Gritty', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'HIGHEST', file: '/highest.mp3', bpm: '144', moods: ['Eerie', 'Dark', 'Atmospheric', 'Minimalistic', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'INSANE', file: '/insane.mp3', bpm: '143', moods: ['Eerie', 'Gritty', 'Dramatic'], addedAt: '2026-04-18' },
    { name: 'HOODED UP', file: '/hoodedup.mp3', bpm: '144', moods: ['Aggressive', 'Gritty', 'Hybrid', 'Dramatic'], addedAt: '2026-04-18' },
    { name: 'PUNCHLINE', file: '/punchline.mp3', bpm: '146', moods: ['Hybrid', 'Jumpy', 'Wavy'], addedAt: '2026-04-18' },
    { name: 'ZYWIOL', file: '/zywiol.mp3', bpm: '143', moods: ['Wavy', 'Upbeat'], addedAt: '2026-04-18' },
    { name: 'ANKARA', file: '/ankara.mp3', bpm: '142', moods: ['Ethnic', 'Jumpy', 'Dark'], addedAt: '2026-04-18' },
    { name: 'CAUSE', file: '/cause.mp3', bpm: '144', moods: ['Melodic', 'Wavy', 'Producer Favourite', 'Upbeat'], addedAt: '2026-04-18' },
    { name: 'CONFLICT', file: '/conflict.mp3', bpm: '144', moods: ['Dark', 'Producer Favourite', 'Mellow', 'Jumpy'], addedAt: '2026-04-18' },
    { name: 'CRASHOUT', file: '/crashout.mp3', bpm: '150', moods: ['Hybrid', 'Aggressive', 'Gritty', 'Violent', 'Hip Hop'], addedAt: '2026-04-18' },
    { name: 'DERRY', file: '/derry.mp3', bpm: '143', moods: ['Dark', 'Violent', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'WILLPOWER', file: '/willpower.mp3', bpm: '144', moods: ['Dark', 'Eerie', 'Melodic', 'Mellow'], addedAt: '2026-04-29' },
    { name: 'BLOOMING', file: '/blooming.mp3', bpm: '144', moods: ['Oriental', 'Ethnic', 'Eerie', 'Melodic'], addedAt: '2026-04-29' },
    { name: 'THE HYBRID', file: '/thehybrid.mp3', bpm: '144', moods: ['Oriental', 'Ethnic', 'Gritty', 'Hybrid', 'Dramatic', 'Melodic', 'Aggressive', 'Chaotic'], addedAt: '2026-04-29' },
    { name: 'LILY', file: '/lily.mp3', bpm: '142', moods: ['Ethnic', 'Oriental', 'Mellow', 'Chill', 'Melodic', 'Insightful'], addedAt: '2026-04-29' },
    { name: 'SUKUDO', file: '/sukudo.mp3', bpm: '143', moods: ['Eerie', 'Dark', 'Hybrid', 'Melodic', 'Jumpy'], addedAt: '2026-04-29' },
    { name: 'EXECUTE', file: '/execute.mp3', bpm: '141', moods: ['Melodic', 'Hybrid', 'Mellow', 'Chill'], addedAt: '2026-04-29' },
    { name: 'LEGENDS', file: '/legends.mp3', bpm: '150', moods: ['Ethnic', 'Hybrid', 'Gritty', 'Dramatic'], addedAt: '2026-04-29' },
    { name: 'RELENTLESS', file: '/relentless.mp3', bpm: '150', moods: ['Dark', 'Chaotic', 'Gritty', 'Ethnic', 'Oriental', 'Aggressive', 'Melodic'], addedAt: '2026-04-29' },
    { name: 'JOHTO', file: '/johto.mp3', bpm: '150', moods: ['Upbeat', 'Hybrid', 'Retro'], addedAt: '2026-04-18' },
    { name: 'MONSOON', file: '/monsoon.mp3', bpm: '140', moods: ['Dark', 'Gritty', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'MORTIFY', file: '/mortify.mp3', bpm: '141', moods: ['Dark', 'Dramatic', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'PERSIAN', file: '/persian.mp3', bpm: '141', moods: ['Ethnic', 'Aggressive', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'ADRIANA', file: '/adriana.mp3', bpm: '122', moods: ['Club', 'Chill', 'Mellow', 'Wavy', 'Atmospheric', 'Minimalistic'], addedAt: '2026-04-29' },
    { name: 'LIGHTNING', file: '/lightning.mp3', bpm: '140', moods: ['Grimy', 'Aggressive', 'Dramatic', 'Minimalistic'], addedAt: '2026-04-29' },
    { name: 'HAYATI', file: '/hayati.mp3', bpm: '145', moods: ['Ethnic', 'Melodic', 'Eerie', 'Mellow'], addedAt: '2026-04-18' },
    { name: 'ALGIERS', file: '/algiers.mp3', bpm: '142', moods: ['Summer', 'Chill', 'Ethnic', 'Mellow', 'Upbeat'], addedAt: '2026-04-18' },
    { name: 'MILITANT', file: '/militia.mp3', bpm: '146', moods: ['Hybrid', 'Aggressive', 'Dramatic', 'Gritty', 'Violent'], addedAt: '2026-04-18' },
    { name: 'EASTWAY', file: '/eastway.mp3', bpm: '143', moods: ['Dark', 'Mellow', 'Eerie', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'MADNESS', file: '/madness.mp3', bpm: '144', moods: ['Atmospheric', 'Mellow', 'Melodic', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'CARA', file: '/cara.mp3', bpm: '116', moods: ['Summer', 'Chill', 'Upbeat', 'Mellow', 'Melodic', 'Wavy'], addedAt: '2026-04-18' },
    { name: 'WAVEY', file: '/wavey.mp3', bpm: '140', moods: ['Jumpy', 'Mellow', 'Wavy', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'POSSESSION', file: '/possession.mp3', bpm: '145', moods: ['Dark', 'Mellow', 'Jumpy', 'Eerie', 'Dramatic'], addedAt: '2026-04-18' },
    { name: 'SOLEMN', file: '/solemn.mp3', bpm: '143', moods: ['Dramatic', 'Melodic', 'Eerie', 'Mellow'], addedAt: '2026-04-18' },
    { name: 'APOLOGIES', file: '/apologies.mp3', bpm: '143', moods: ['Melodic', 'Mellow', 'Dramatic'], addedAt: '2026-04-18' },
    { name: 'CYCLE OF LIFE', file: '/cycleoflife.mp3', bpm: '143', moods: ['Gritty', 'Mellow', 'Grimy'], addedAt: '2026-04-18' },
    { name: 'RAMPAGE', file: '/rampage.mp3', bpm: '143', moods: ['Dark', 'Aggressive', 'Gritty'], addedAt: '2026-04-18' },
    { name: 'PREMIUM', file: '/premium.mp3', bpm: '150', moods: ['Hybrid', 'Producer Favourite', 'Hip Hop'], addedAt: '2026-04-18' },
    { name: 'QOTD', file: '/qotd.mp3', bpm: '143', moods: ['Eerie', 'Mellow', 'Ethnic', 'Dark'], addedAt: '2026-04-18' },
    { name: 'REMEMBER ME', file: '/rememberme.mp3', bpm: '140', moods: ['Dramatic', 'Gritty', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'SCRATCH', file: '/scratch.mp3', bpm: '145', moods: ['Aggressive', 'Angry', 'Violent'], addedAt: '2026-04-18' },
    { name: 'HILAL 2', file: '/hilal2.mp3', bpm: '143', moods: ['Ethnic', 'Mellow', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'SAMBA', file: '/samba.mp3', bpm: '140', moods: ['Melodic', 'Chill', 'Ethnic', 'Wavy', 'Mellow'], addedAt: '2026-04-18' },
    { name: 'MIND THE GAP', file: '/mindthegap.mp3', bpm: '145', moods: ['Mellow', 'Gritty', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'NGOLO', file: '/ngolo.mp3', bpm: '141', moods: ['Melodic', 'Chill', 'Upbeat'], addedAt: '2026-04-18' },
    { name: 'ALLEY', file: '/alley.mp3', bpm: '142', moods: ['Aggressive', 'Gritty', 'Eerie', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'VIRTUOSO', file: '/virtuoso.mp3', bpm: '142', moods: ['Grimy', 'Gritty', 'Minimalistic', 'Mellow'], addedAt: '2026-04-18' },
    { name: 'MELODY', file: '/melody.mp3', bpm: '142', moods: ['Mellow', 'Melodic', 'Hybrid', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'KARZZZ', file: '/karzzz.mp3', bpm: '142', moods: ['Aggressive', 'Hybrid', 'Gritty', 'Violent'], addedAt: '2026-04-18' },
    { name: 'SHIFTING', file: '/shifting.mp3', bpm: '142', moods: ['Aggressive', 'Gritty', 'Minimalistic'], addedAt: '2026-04-18' },
    {
      name: 'STEREO TYPICAL',
      file: '/stereotypical.mp3',
      bpm: '142',
      moods: ['Eerie', 'Dubstep', 'Dark', 'Atmospheric', 'Melodic'],
      addedAt: '2026-04-18'
    },
    { name: 'TPW', file: '/tpw.mp3', bpm: '145', moods: ['Ethnic', 'Jumpy', 'Dark'], addedAt: '2026-04-18' },
    {
      name: 'BELKI',
      file: '/belki.mp3',
      bpm: '145',
      moods: ['Ethnic', 'Grimy', 'Minimalistic', 'Producer Favourite', 'Aggressive'],
      addedAt: '2026-04-18'
    },
    { name: 'KITE', file: '/kite.mp3', bpm: '145', moods: ['Ethnic', 'Eerie', 'Mellow', 'Dark'], addedAt: '2026-04-18' },
    { name: 'FRANKFURT', file: '/frankfurt.mp3', bpm: '144', moods: ['Ethnic', 'Eerie', 'Minimalistic', 'Dark'], addedAt: '2026-04-18' },
    { name: 'SKITZ', file: '/skitz.mp3', bpm: '145', moods: ['Aggressive', 'Chaotic', 'Jumpy', 'Wavy'], addedAt: '2026-04-18' },
    { name: 'RAGEQUIT', file: '/ragequit.mp3', bpm: '145', moods: ['Grimy', 'Angry', 'Gritty', 'Retro'], addedAt: '2026-04-18' },
    { name: 'DAI', file: '/dai.mp3', bpm: '143', moods: ['Dubstep', 'Club', 'Hybrid', 'Mellow', 'Melodic'], addedAt: '2026-04-18' },
    { name: 'FINISHED', file: '/finished.mp3', bpm: '144', moods: ['Dark', 'Gritty', 'Eerie', 'Ethnic'], addedAt: '2026-04-18' },
    { name: 'TRIDENT', file: '/trident.mp3', bpm: '143', moods: ['Dramatic', 'Atmospheric', 'Mellow', 'Dark', 'Melodic'], addedAt: '2026-04-18' },
    {
      name: 'THE GAME',
      file: '/thegame.mp3',
      bpm: '150',
      moods: ['Hybrid', 'Aggressive', 'Hip Hop', 'Retro'],
      addedAt: '2026-04-18'
    },
    { name: 'NOTORIETY', file: '/notoriety.mp3', bpm: '143', moods: ['Eerie', 'Jumpy', 'Minimalistic'], addedAt: '2026-04-18' },
    {
      name: 'SUBZERO',
      file: '/subzero.mp3',
      bpm: '144',
      moods: ['Aggressive', 'Atmospheric', 'Producer Favourite'],
      addedAt: '2026-04-18'
    },
    { name: 'CUBE', file: '/cube.mp3', bpm: '146', moods: ['Retro', 'Hybrid'], addedAt: '2026-04-18' },
    { name: 'OMEN', file: '/omen.mp3', bpm: '145', moods: ['Dramatic', 'Gritty', 'Eerie'], addedAt: '2026-04-18' },
    { name: 'WINTERS', file: '/winters.mp3', bpm: '145', moods: ['Eerie', 'Atmospheric', 'Dramatic'], addedAt: '2026-04-18' },
    {
      name: 'FAMILY TREE',
      file: '/familytree.mp3',
      bpm: '147',
      moods: ['Dramatic', 'Mellow', 'Insightful', 'Hip Hop'],
      addedAt: '2026-04-18'
    },
    {
      name: 'CHURCH',
      file: '/church.mp3',
      bpm: '144',
      moods: ['Dramatic', 'Grimy', 'Gritty', 'Aggressive'],
      addedAt: '2026-04-18'
    },
    { name: 'L1TNESS', file: '/l1tness.mp3', bpm: '143', moods: ['Grimy', 'Used for Battle', 'Wavy', 'Jumpy', 'Minimalistic'], addedAt: '2026-04-18' },
    { name: 'F4TALITY', file: '/f4tality.mp3', bpm: '143', moods: ['Dramatic', 'Used for Battle', 'Dark', 'Gritty'], addedAt: '2026-04-18' }
  ]

  const isRecentlyAdded = (addedAt) => {
    if (!addedAt) return false

    const addedDate = new Date(`${addedAt}T00:00:00`)
    const now = new Date()
    const diffInDays = (now - addedDate) / (1000 * 60 * 60 * 24)

    return diffInDays >= 0 && diffInDays <= 5
  }

  const sortedBeats = [...beats].sort((a, b) => a.name.localeCompare(b.name))

  const bpmOptions = [...new Set(sortedBeats.map((beat) => beat.bpm).filter(Boolean))].sort(
    (a, b) => Number(a) - Number(b)
  )

  const moodOptions = [...new Set(sortedBeats.flatMap((beat) => beat.moods || []))].sort()

  const filteredBeats = sortedBeats.filter((beat) => {
    const matchesBpm = selectedBpm === '' || beat.bpm === selectedBpm
    const matchesMood =
      selectedMoods.length === 0 || selectedMoods.every((mood) => beat.moods.includes(mood))
    const matchesNewOnly = !showNewOnly || isRecentlyAdded(beat.addedAt)

    return matchesBpm && matchesMood && matchesNewOnly
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

  const handleSkipForward = () => {
    if (!audioRef.current || !duration) return

    const nextTime = Math.min(audioRef.current.currentTime + 30, duration)
    audioRef.current.currentTime = nextTime
    setElapsed(nextTime)
  }

  const handleResetFilters = () => {
    setSelectedBpm('')
    setSelectedMoods([])
    setShowNewOnly(false)
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
    background: 'linear-gradient(180deg, rgba(58, 8, 8, 0.96), rgba(28, 4, 4, 0.96))',
    border: '1px solid rgba(255, 77, 77, 0.22)',
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
      hoveredCard === id ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 77, 77, 0.08)',
    color: 'white',
    textDecoration: 'none',
    border:
      hoveredCard === id
        ? '1px solid rgba(255, 77, 77, 0.35)'
        : '1px solid rgba(255, 255, 255, 0.08)',
    transform: hoveredCard === id ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hoveredCard === id ? '0 10px 20px rgba(0, 0, 0, 0.22)' : 'none',
    transition: 'all 160ms ease'
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 16px 135px',
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.72)), url('/background2.jpg')",
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
        {!hideSideColumn && (
          <div
            style={{
              flex: '0 0 214px',
              width: 214,
              maxWidth: '100%',
              display: 'grid',
              gap: 14,
              position: 'sticky',
              top: 24,
              alignSelf: 'flex-start'
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
              </aside>
            )}
          </div>
        )}

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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                textAlign: 'left'
              }}
            >
              <div>
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
                    margin: '14px 0 0',
                    color: 'white',
                    fontSize: 'clamp(28px, 6vw, 42px)',
                    lineHeight: 1.1
                  }}
                >
                  The Producer
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setIsBioExpanded((value) => !value)}
                aria-expanded={isBioExpanded}
                aria-label={isBioExpanded ? 'Collapse producer bio' : 'Expand producer bio'}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  border: '1px solid rgba(255, 77, 77, 0.45)',
                  background: 'rgba(196, 0, 0, 0.9)',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 10px 26px rgba(196, 0, 0, 0.35)',
                  transition: 'transform 160ms ease'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 24,
                    lineHeight: 1,
                    transform: isBioExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 160ms ease'
                  }}
                >
                  ▼
                </span>
              </button>
            </div>

            {isBioExpanded && (
              <div
                style={{
                  marginTop: 22,
                  paddingTop: 22,
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  textAlign: 'left'
                }}
              >
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
            )}
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
              gridTemplateColumns: isMobile
                ? 'repeat(2, minmax(0, 1fr))'
                : 'minmax(0, 120px) minmax(0, 210px) auto auto',
              justifyContent: 'center',
              gap: 10,
              maxWidth: isMobile ? 320 : 620,
              margin: '0 auto 20px'
            }}
          >
            <CustomSelect
              value={selectedBpm}
              onChange={setSelectedBpm}
              placeholder="BPM"
              options={bpmOptions.map((bpm) => ({
                value: bpm,
                label: bpm
              }))}
            />

            <CustomSelect
              value={selectedMoods}
              onChange={setSelectedMoods}
              placeholder="Mood"
              multiple
              options={moodOptions.map((mood) => ({
                value: mood,
                label: mood
              }))}
            />

            <button
              type="button"
              onClick={() => setShowNewOnly((value) => !value)}
              style={{
                minHeight: 41,
                padding: isMobile ? '0 10px' : '0 18px',
                width: isMobile ? '100%' : 'auto',
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: showNewOnly ? '#3f235c' : 'white',
                color: showNewOnly ? 'white' : '#111',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)'
              }}
            >
              New Beats
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={selectedBpm === '' && selectedMoods.length === 0 && !showNewOnly}
              style={{
                minHeight: 41,
                padding: isMobile ? '0 10px' : '0 18px',
                width: isMobile ? '100%' : 'auto',
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'white',
                color: '#111',
                fontSize: 13,
                fontWeight: 700,
                cursor:
                  selectedBpm === '' && selectedMoods.length === 0 && !showNewOnly
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  selectedBpm === '' && selectedMoods.length === 0 && !showNewOnly
                    ? 0.55
                    : 1,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)'
              }}
            >
              Reset
            </button>
          </div>

          {selectedMoods.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 8,
                maxWidth: 900,
                margin: '0 auto 16px'
              }}
            >
              {selectedMoods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() =>
                    setSelectedMoods((current) => current.filter((item) => item !== mood))
                  }
                  style={{
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: '#2f2f2f',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {mood} ×
                </button>
              ))}
            </div>
          )}

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
              const isNew = isRecentlyAdded(beat.addedAt)

              return (
                <button
                  key={beat.name}
                  onClick={() => handleBeatClick(beat)}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    background: isPlaying
                      ? '#c40000'
                      : isNew
                        ? '#3f235c'
                        : 'rgba(15, 15, 15, 0.88)',
                    border: isNew
                      ? '1px solid rgba(151, 110, 201, 0.7)'
                      : '1px solid rgba(255, 255, 255, 0.16)',
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
                      : isNew
                        ? '0 10px 30px rgba(63, 35, 92, 0.32)'
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
            maxWidth: 1180,
            margin: '0 auto',
            padding: '12px 18px 14px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '140px minmax(220px, 1fr) 220px',
            alignItems: 'center',
            gap: isMobile ? 8 : 18
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
              gap: 12,
              minWidth: 0
            }}
          >
            {nowPlaying !== 'None' && (
              <>
                <button
                  type="button"
                  onClick={handleSkipForward}
                  aria-label="Skip forward 30 seconds"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5a7 7 0 1 1-6.2 3.75"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4.7 4.9v4.2h4.2"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x="12"
                      y="15.2"
                      textAnchor="middle"
                      fill="white"
                      fontSize="7"
                      fontWeight="700"
                      fontFamily="Arial, sans-serif"
                    >
                      30
                    </text>
                  </svg>
                </button>

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
              </>
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
```
