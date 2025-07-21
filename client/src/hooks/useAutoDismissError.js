import { useState, useEffect} from 'react'

const useAutoDismissError = (timeout = 3000) => {
    const [errorMessage, setErrorMessage] = useState('')

    const showError = (message) => {
        setErrorMessage(message)
    }

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('')
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [errorMessage, timeout])

    return [errorMessage, showError]

}

export default useAutoDismissError