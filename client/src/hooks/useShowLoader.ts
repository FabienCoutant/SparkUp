import { useEffect, useState } from 'react'

export const useShowLoader = () => {
  const [showLoader, setShowLoader] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false)
    }, 800)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return showLoader
}

