'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Send, Sparkles } from 'lucide-react'
import { useVoiceRecorder } from '@/hooks/use-voice-recorder'

interface HybridComposerProps {
    initialText?: string
    senderName: string
    onSend: (text: string) => void
}

export function HybridComposer({ initialText = '', senderName, onSend }: HybridComposerProps) {
    const [text, setText] = useState(initialText)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isTranscribing, setIsTranscribing] = useState(false)

    const { isRecording, startRecording, stopRecording, audioBlob, permissionError } = useVoiceRecorder()

    // 1. Fetch Suggestions on Mount
    useEffect(() => {
        async function fetchSuggestions() {
            if (!senderName) return
            try {
                const res = await fetch('/api/ai/suggest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailBody: initialText || ' ', senderName })
                })
                const data = await res.json()
                if (data.suggestions && Array.isArray(data.suggestions)) {
                    setSuggestions(data.suggestions)
                }
            } catch (e) {
                console.error('Failed to fetch suggestions', e)
            }
        }
        fetchSuggestions()
    }, [senderName, initialText])

    // 2. Handle Voice Transcriptions
    const prevBlobRef = useRef<Blob | null>(null)

    useEffect(() => {
        if (audioBlob && audioBlob !== prevBlobRef.current) {
            prevBlobRef.current = audioBlob
            handleTranscribe(audioBlob)
        }
    }, [audioBlob])

    const handleTranscribe = async (blob: Blob) => {
        setIsTranscribing(true)
        try {
            const formData = new FormData()
            formData.append('file', blob, 'recording.mp3')

            const res = await fetch('/api/ai/transcribe', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()

            if (data.text) {
                // Append transcribed text
                setText(prev => {
                    const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : ''
                    return prev + separator + data.text
                })
            }
        } catch (error) {
            console.error('Transcription failed', error)
        } finally {
            setIsTranscribing(false)
        }
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition-shadow hover:shadow-md">

            {/* AI Suggestions Layer */}
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium px-1">
                        <Sparkles size={12} className="text-blue-500" />
                        <span>AI Suggestions:</span>
                    </div>
                    {suggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => setText(prev => prev + (prev ? ' ' : '') + suggestion)}
                            className="cursor-pointer bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all font-medium"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Text Area */}
            <textarea
                className="w-full min-h-[150px] p-2 text-gray-800 focus:outline-none focus:ring-0 text-base resize-y placeholder:text-gray-400"
                placeholder={isRecording ? "Listening..." : "Type your reply or use voice..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isTranscribing}
            />

            {/* Action Toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">

                {/* Voice Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleRecording}
                        className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${isRecording
                                ? 'animate-pulse bg-red-50 text-red-600 ring-2 ring-red-100'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                            } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isTranscribing}
                        title={isRecording ? 'Stop Recording' : 'Start Recording'}
                    >
                        <Mic size={20} />
                    </button>

                    <div className="flex flex-col justify-center">
                        {isRecording && (
                            <span className="text-xs font-semibold text-red-500 animate-pulse">
                                Recording...
                            </span>
                        )}
                        {isTranscribing && (
                            <span className="text-xs font-medium text-blue-500 animate-pulse">
                                Transcribing...
                            </span>
                        )}
                        {permissionError && (
                            <span className="text-xs font-medium text-red-500">
                                Mic blocked
                            </span>
                        )}
                    </div>
                </div>

                {/* Send Button */}
                <button
                    onClick={() => onSend(text)}
                    disabled={!text.trim() || isTranscribing}
                    className="flex items-center gap-2 bg-black text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <span>Send</span>
                    <Send size={16} />
                </button>
            </div>
        </div>
    )
}
