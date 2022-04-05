import { useState, useEffect } from 'react'

const getDimension = () => {
    return { width: window.innerWidth, height: window.innerHeight };
}

const useScreenDimensions = () => {
    const [dimension, setDimension] =
        useState(getDimension())

    const updateDimension = (_event: any) => {
        setDimension(getDimension())
    }

    useEffect(() => {
        window.addEventListener(
            'orientationchange',
            updateDimension
        )
        return () => {
            window.removeEventListener(
                'orientationchange',
                updateDimension
            )
        }
    }, [])

    return dimension;
}

export default useScreenDimensions