import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that scrolls to the top of the page on route change.
 * This ensures users always start at the top when navigating to a new page.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top instantly without smooth scrolling
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
