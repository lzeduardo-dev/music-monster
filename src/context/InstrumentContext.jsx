import { createContext, useContext, useState, useEffect } from 'react'
import { setInstrument } from '../lib/audio.js'

const InstrumentContext = createContext(null)

export function InstrumentProvider({ children }) {
  const [instrument, setInstrumentState] = useState(
    () => localStorage.getItem('hh_instrument') ?? 'violao'
  )

  useEffect(() => {
    setInstrument(instrument)
  }, [instrument])

  const changeInstrument = (key) => {
    setInstrumentState(key)
  }

  return (
    <InstrumentContext.Provider value={{ instrument, changeInstrument }}>
      {children}
    </InstrumentContext.Provider>
  )
}

export function useInstrument() {
  return useContext(InstrumentContext)
}
