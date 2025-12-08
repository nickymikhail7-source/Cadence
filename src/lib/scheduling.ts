import { prisma } from '@/lib/prisma'

interface TimeSlot {
    start: Date
    end: Date
}

interface GetAvailableSlotsInput {
    userId: string
    meetingTypeId: string
    startDate: Date
    endDate: Date
    timezone: string
}

// Helper to set time from minutes since midnight
function setTimeFromMinutes(date: Date, minutes: number): Date {
    const result = new Date(date)
    result.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
    return result
}

// Helper to add minutes to a date
function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000)
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// Check if a slot conflicts with existing meetings or blocked times
function hasConflict(
    slotStart: Date,
    slotEnd: Date,
    meetings: Array<{ startTime: Date; endTime: Date }>,
    blockedTimes: Array<{ startTime: Date; endTime: Date }>,
    bufferBefore: number,
    bufferAfter: number
): boolean {
    // Add buffer to slot
    const bufferedStart = addMinutes(slotStart, -bufferBefore)
    const bufferedEnd = addMinutes(slotEnd, bufferAfter)

    for (const meeting of meetings) {
        if (
            (bufferedStart >= meeting.startTime && bufferedStart < meeting.endTime) ||
            (bufferedEnd > meeting.startTime && bufferedEnd <= meeting.endTime) ||
            (bufferedStart <= meeting.startTime && bufferedEnd >= meeting.endTime)
        ) {
            return true
        }
    }

    for (const blocked of blockedTimes) {
        if (
            (bufferedStart >= blocked.startTime && bufferedStart < blocked.endTime) ||
            (bufferedEnd > blocked.startTime && bufferedEnd <= blocked.endTime) ||
            (bufferedStart <= blocked.startTime && bufferedEnd >= blocked.endTime)
        ) {
            return true
        }
    }

    return false
}

// Get available time slots for booking
export async function getAvailableSlots(
    input: GetAvailableSlotsInput
): Promise<TimeSlot[]> {
    const { userId, meetingTypeId, startDate, endDate } = input

    // 1. Get user's base availability
    const availability = await prisma.availability.findMany({
        where: { userId, isEnabled: true },
    })

    if (availability.length === 0) {
        // No availability set, return empty
        return []
    }

    // 2. Get meeting type settings
    const meetingType = await prisma.meetingType.findUnique({
        where: { id: meetingTypeId },
    })

    if (!meetingType) {
        return []
    }

    // 3. Get existing meetings in date range
    const existingMeetings = await prisma.meeting.findMany({
        where: {
            userId,
            startTime: { gte: startDate },
            endTime: { lte: endDate },
            status: { in: ['SCHEDULED', 'CONFIRMED'] },
        },
        select: {
            startTime: true,
            endTime: true,
        },
    })

    // 4. Get blocked times
    const blockedTimes = await prisma.blockedTime.findMany({
        where: {
            userId,
            startTime: { lte: endDate },
            endTime: { gte: startDate },
        },
        select: {
            startTime: true,
            endTime: true,
        },
    })

    // 5. Calculate available slots
    const slots: TimeSlot[] = []
    const now = new Date()
    const minNoticeTime = addMinutes(now, meetingType.minNotice)

    // Iterate through each day in range
    let currentDate = new Date(startDate)
    currentDate.setHours(0, 0, 0, 0)

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay()
        const dayAvailability = availability.filter(a => a.dayOfWeek === dayOfWeek)

        for (const avail of dayAvailability) {
            // Generate slots for this availability window
            let slotStart = setTimeFromMinutes(currentDate, avail.startTime)
            const windowEnd = setTimeFromMinutes(currentDate, avail.endTime)

            while (slotStart < windowEnd) {
                const slotEnd = addMinutes(slotStart, meetingType.duration)

                // Check if slot fits in window
                if (slotEnd > windowEnd) break

                // Check minimum notice
                if (slotStart < minNoticeTime) {
                    slotStart = addMinutes(slotStart, 30)
                    continue
                }

                // Check for conflicts
                const conflict = hasConflict(
                    slotStart,
                    slotEnd,
                    existingMeetings,
                    blockedTimes,
                    meetingType.bufferBefore,
                    meetingType.bufferAfter
                )

                if (!conflict) {
                    slots.push({ start: new Date(slotStart), end: new Date(slotEnd) })
                }

                // Move to next slot (30-minute intervals)
                slotStart = addMinutes(slotStart, 30)
            }
        }

        currentDate = addDays(currentDate, 1)
    }

    return slots
}

// Create default availability (Mon-Fri 9-5)
export async function createDefaultAvailability(userId: string): Promise<void> {
    const defaultSchedule = [
        { dayOfWeek: 1, startTime: 540, endTime: 1020 }, // Monday 9am-5pm
        { dayOfWeek: 2, startTime: 540, endTime: 1020 }, // Tuesday
        { dayOfWeek: 3, startTime: 540, endTime: 1020 }, // Wednesday
        { dayOfWeek: 4, startTime: 540, endTime: 1020 }, // Thursday
        { dayOfWeek: 5, startTime: 540, endTime: 1020 }, // Friday
    ]

    for (const day of defaultSchedule) {
        await prisma.availability.create({
            data: {
                userId,
                ...day,
                isEnabled: true,
            },
        })
    }
}

// Format time from minutes since midnight
export function formatTimeFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

// Parse time string to minutes since midnight
export function parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}
