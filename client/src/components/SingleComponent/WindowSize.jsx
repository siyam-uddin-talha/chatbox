import { useState, useEffect } from 'react'

const WindowSize = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const GetWindowWidht = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", GetWindowWidht)
        return () => {
            window.removeEventListener("resize", GetWindowWidht)
        }
    }, [])
    return windowWidth
}

export default WindowSize
