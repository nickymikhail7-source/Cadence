'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TimeSlot {
    start: string
    end: string
}

interface MeetingType {
    name: string
    duration: number
    description: string | null
    questions: Array<{ id: string; question: string; required: boolean }> | null
}

export default function BookMeetingPage() {
    const params = useParams()
    const router = useRouter()
    const username = params.username as string
    const slug = params.slug as string

    const [loading, setLoading] = useState(true)
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [meetingType, setMeetingType] = useState<MeetingType | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [step, setStep] = useState<'select' | 'confirm'>('select')
    const [booking, setBooking] = useState(false)
    const [booked, setBooked] = useState<{ startTime: string; meetingLink?: string } | null>(null)

    // Form state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Fetch available slots
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true)
            try {
                const startDate = new Date()
                const endDate = new Date()
                endDate.setDate(endDate.getDate() + 14) // Next 2 weeks

                const params = new URLSearchParams({
                    username,
                    slug,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })

                const response = await fetch(`/api/availability/slots?${params}`)
                if (!response.ok) throw new Error('Failed to load availability')

                const data = await response.json()
                setSlots(data.slots)
                setMeetingType(data.meetingType)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load')
            } finally {
                setLoading(false)
            }
        }

        fetchSlots()
    }, [username, slug])

    // Group slots by date
    const slotsByDate = slots.reduce((acc, slot) => {
        const date = new Date(slot.start).toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(slot)
        return acc
    }, {} as Record<string, TimeSlot[]>)

    const dates = Object.keys(slotsByDate)

    // Handle booking
    const handleBook = async () => {
        if (!selectedSlot || !name || !email) return

        setBooking(true)
        setError(null)

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meetingTypeId: slug, // We need to pass the actual ID
                    startTime: selectedSlot.start,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    attendee: { name, email },
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Booking failed')
            }

            const data = await response.json()
            setBooked({
                startTime: data.meeting.startTime,
                meetingLink: data.meeting.meetingLink,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Booking failed')
        } finally {
            setBooking(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-border-default border-t-accent rounded-full animate-spin" />
            </div>
        )
    }

    if (booked) {
        return (
            <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
                <div className="max-w-md mx-auto text-center px-4">
                    <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary mb-2">You&apos;re booked!</h1>
                    <p className="text-text-tertiary mb-6">
                        {meetingType?.name} on {new Date(booked.startTime).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })} at {new Date(booked.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </p>
                    <p className="text-sm text-text-quaternary">
                        A calendar invitation has been sent to {email}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-secondary py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-text-primary">
                        {meetingType?.name}
                    </h1>
                    <p className="text-text-tertiary mt-1">
                        {meetingType?.duration} minutes
                    </p>
                    {meetingType?.description && (
                        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
                            {meetingType.description}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-danger-light text-danger text-sm px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {step === 'select' ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Date Selection */}
                        <div className="bg-bg-primary rounded-xl p-6 border border-border-subtle">
                            <h2 className="font-medium text-text-primary mb-4">Select a date</h2>
                            <div className="space-y-2">
                                {dates.length === 0 ? (
                                    <p className="text-text-tertiary text-sm">No available dates</p>
                                ) : (
                                    dates.slice(0, 7).map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => {
                                                setSelectedDate(date)
                                                setSelectedSlot(null)
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedDate === date
                                                    ? 'bg-accent text-white'
                                                    : 'bg-bg-secondary hover:bg-bg-hover text-text-primary'
                                                }`}
                                        >
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="bg-bg-primary rounded-xl p-6 border border-border-subtle">
                            <h2 className="font-medium text-text-primary mb-4">Select a time</h2>
                            {!selectedDate ? (
                                <p className="text-text-tertiary text-sm">Select a date first</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {slotsByDate[selectedDate]?.map((slot) => (
                                        <button
                                            key={slot.start}
                                            onClick={() => {
                                                setSelectedSlot(slot)
                                                setStep('confirm')
                                            }}
                                            className="px-4 py-2 text-sm rounded-lg bg-bg-secondary hover:bg-accent hover:text-white
                        text-text-primary transition-colors"
                                        >
                                            {new Date(slot.start).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Confirmation Form */
                    <div className="max-w-md mx-auto bg-bg-primary rounded-xl p-6 border border-border-subtle">
                        <button
                            onClick={() => setStep('select')}
                            className="text-sm text-accent hover:underline mb-4 flex items-center gap-1"
                        >
                            ← Back
                        </button>

                        <div className="bg-bg-secondary rounded-lg p-4 mb-6">
                            <p className="font-medium text-text-primary">{meetingType?.name}</p>
                            <p className="text-sm text-text-tertiary">
                                {selectedSlot && new Date(selectedSlot.start).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })} at {selectedSlot && new Date(selectedSlot.start).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Your name
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Your email
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <Button
                                onClick={handleBook}
                                loading={booking}
                                disabled={!name || !email}
                                className="w-full"
                            >
                                Confirm Booking
                            </Button>
                        </div>
                    </div>
                )}

                {/* Powered by */}
                <div className="text-center mt-12">
                    <p className="text-xs text-text-quaternary">
                        Powered by{' '}
                        <a href="/" className="text-accent hover:underline">
                            Cadence
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
