import * as React from 'react'

const MOBILE_BREAKPOINT = 768

// TODO: Consider using @react-hook/media-query for better performance and simpler code
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        setIsMobile(mediaQuery.matches)

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return isMobile
}
