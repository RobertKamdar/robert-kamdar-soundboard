function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredOption, setHoveredOption] = useState(null)
  const [focusedOption, setFocusedOption] = useState(null)
  const wrapperRef = useRef(null)
  const menuRef = useRef(null)
  const optionRefs = useRef({})
  const menuClassName = 'custom-select-menu'

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

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768
  const keyboardOptions = [{ value: '', label: placeholder }, ...options]

  useEffect(() => {
    if (!isOpen || isSmallScreen || focusedOption === null) return

    const optionKey = focusedOption === '' ? '__placeholder__' : focusedOption
    const activeOption = optionRefs.current[optionKey]

    if (activeOption) {
      activeOption.scrollIntoView({
        block: 'nearest'
      })
    }
  }, [focusedOption, isOpen, isSmallScreen])

  const getCurrentIndex = () => {
    if (focusedOption !== null) {
      return keyboardOptions.findIndex((option) => option.value === focusedOption)
    }

    return keyboardOptions.findIndex((option) => option.value === value)
  }

  const handleKeyDown = (event) => {
    if (isSmallScreen) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (!isOpen) {
        setIsOpen(true)
        setFocusedOption(value)
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
        setFocusedOption(value)
        return
      }

      const currentIndex = getCurrentIndex()
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0

      setFocusedOption(keyboardOptions[nextIndex].value)
      setHoveredOption(null)
    }

    if (event.key === 'Enter') {
      if (!isOpen) return

      event.preventDefault()
      const selectedValue = focusedOption !== null ? focusedOption : value
      onChange(selectedValue)
      setIsOpen(false)
      setHoveredOption(null)
      setFocusedOption(null)
    }

    if (event.key === 'Escape') {
      if (!isOpen) return

      event.preventDefault()
      setIsOpen(false)
      setHoveredOption(null)
      setFocusedOption(null)
    }
  }

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
          setFocusedOption(value)
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
          ref={menuRef}
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
            style={{
              width: '100%',
              minHeight: isSmallScreen ? 34 : 41,
              padding: isSmallScreen ? '9px 14px' : '12px 14px',
              border: 'none',
              background:
                hoveredOption === '' || focusedOption === ''
                  ? '#c40000'
                  : value === ''
                    ? 'rgba(196, 0, 0, 0.18)'
                    : '#2f2f2f',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            {placeholder}
          </button>

          {options.map((option) => (
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
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
                setHoveredOption(null)
                setFocusedOption(null)
              }}
              style={{
                width: '100%',
                minHeight: isSmallScreen ? 34 : 41,
                padding: isSmallScreen ? '9px 14px' : '12px 14px',
                border: 'none',
                background:
                  hoveredOption === option.value || focusedOption === option.value
                    ? '#c40000'
                    : value === option.value
                      ? 'rgba(196, 0, 0, 0.18)'
                      : '#2f2f2f',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
