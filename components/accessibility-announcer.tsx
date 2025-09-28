"use client"

import { useEffect, useRef } from "react"

interface AccessibilityAnnouncerProps {
  message: string
  priority?: "polite" | "assertive"
}

export function AccessibilityAnnouncer({ message, priority = "polite" }: AccessibilityAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear previous message
      announcerRef.current.textContent = ""

      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  return <div ref={announcerRef} aria-live={priority} aria-atomic="true" className="sr-only" />
}
