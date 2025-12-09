import { useState, useRef, useCallback } from 'react'

interface UseVoiceRecorderReturn {
    isRecording: boolean
    audioBlob: Blob | null
    permissionError: boolean
    startRecording: () => Promise<void>
    stopRecording: () => void
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [permissionError, setPermissionError] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const startRecording = useCallback(async () => {
        setPermissionError(false)
        setAudioBlob(null)
        chunksRef.current = []

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Media Devices API not supported')
            }

            // Initialize recorder
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder

            // Collect data chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data)
                }
            }

            // Handle stop
            mediaRecorder.onstop = () => {
                // Create audio blob
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' })
                setAudioBlob(blob)

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop())
            }

            // Start recording
            mediaRecorder.start()
            setIsRecording(true)

        } catch (error) {
            console.error('Failed to start recording:', error)
            setPermissionError(true)
        }
    }, [])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }, [])

    return {
        isRecording,
        audioBlob,
        permissionError,
        startRecording,
        stopRecording
    }
}
