import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ProgressContext = createContext(null)
const STORAGE_KEY = 'harmony-hub.progress.v1'

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const empty = { completedLessons: {}, ear: { score: 0, attempts: 0 }, bookmarks: {}, feedback: {} }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return empty
      const parsed = JSON.parse(raw)
      // Ensure all keys exist (migration from older versions)
      return { ...empty, ...parsed }
    } catch {
      return empty
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const value = useMemo(() => ({
    progress,
    markLesson(moduleId, lessonId) {
      const key = `${moduleId}:${lessonId}`
      setProgress((p) => {
        const completed = { ...p.completedLessons }
        if (completed[key]) {
          delete completed[key]
        } else {
          completed[key] = Date.now()
        }
        return { ...p, completedLessons: completed }
      })
    },
    isComplete(moduleId, lessonId) {
      return Boolean(progress.completedLessons[`${moduleId}:${lessonId}`])
    },
    addEarResult(correct) {
      setProgress((p) => ({
        ...p,
        ear: {
          score: p.ear.score + (correct ? 1 : 0),
          attempts: p.ear.attempts + 1
        }
      }))
    },
    // Mark or unmark a whole module (toggles based on current state)
    markModule(moduleId, lessonIds) {
      setProgress((p) => {
        const completed = { ...p.completedLessons }
        const allDone = lessonIds.every((id) => Boolean(completed[`${moduleId}:${id}`]))
        const ts = Date.now()
        if (allDone) {
          lessonIds.forEach((id) => { delete completed[`${moduleId}:${id}`] })
        } else {
          lessonIds.forEach((id) => { completed[`${moduleId}:${id}`] = ts })
        }
        return { ...p, completedLessons: completed }
      })
    },
    isModuleComplete(moduleId, lessonIds) {
      return lessonIds.length > 0 && lessonIds.every((id) => Boolean(progress.completedLessons[`${moduleId}:${id}`]))
    },
    // Bookmark a specific module (toggle)
    toggleBookmark(moduleId) {
      setProgress((p) => {
        const bookmarks = { ...(p.bookmarks || {}) }
        if (bookmarks[moduleId]) delete bookmarks[moduleId]
        else bookmarks[moduleId] = Date.now()
        return { ...p, bookmarks }
      })
    },
    isBookmarked(moduleId) {
      return Boolean(progress.bookmarks?.[moduleId])
    },
    // Lesson feedback (👍 / 👎)
    setFeedback(moduleId, value) {
      setProgress((p) => ({
        ...p,
        feedback: { ...(p.feedback || {}), [moduleId]: value },
      }))
    },
    getFeedback(moduleId) {
      return progress.feedback?.[moduleId] ?? null
    },
    reset() {
      setProgress({ completedLessons: {}, ear: { score: 0, attempts: 0 }, bookmarks: {}, feedback: {} })
    }
  }), [progress])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
