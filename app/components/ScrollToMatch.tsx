'use client'
import { useEffect } from 'react'

export default function ScrollToMatch({ id }: { id: string }) {
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }, 600)
    return () => {
      clearTimeout(timer)
      window.history.scrollRestoration = 'auto'
    }
  }, [id])
  return null
}
