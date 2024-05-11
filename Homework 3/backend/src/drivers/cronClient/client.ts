import { ICronClient } from "../base/cron";

type ParsedExpression = {
    secondsSet: Set<'*' | string>
    minutesSet: Set<'*' | string>
    hoursSet: Set<'*' | string>
    daysSet: Set<'*' | string>
    dayOfTheWeeksSet: Set<'*' | string>
    monthsSet: Set<'*' | string>
    yearsSet: Set<'*' | string>
    callback: () => Promise<void>
}

type Year = {
    year: {
        '*'?: (() => Promise<void>)[],
        [key: string]: (() => Promise<void>)[]
    }
}
type Month = {
    month: {
        '*'?: Year,
        [key: string]: Year
    }
}
type DayOfTheWeek = {
    dayOfTheWeek: {
        '*'?: Month,
        [key: string]: Month
    }
}
type Day = {
    day: {
        '*'?: DayOfTheWeek,
        [key: string]: DayOfTheWeek
    }
}
type Hour = {
    hour: {
        '*'?: Day,
        [key: string]: Day
    }
}
type Minute = {
    minute: {
        '*'?: Hour,
        [key: string]: Hour
    }
}
type Second = {
    second: {
        '*'?: Minute,
        [key: string]: Minute
    }
}


type Self = {
    crons: Second

    run(): void
    parseExpression(expression: string, callback: () => Promise<void>): ParsedExpression
    parseRangeExpression<T>(expression: string, lowerLimit: number, upperLimit: number, valueMapper: (value: string) => number, valueUnMapper: (value: number) => T): Set<'*' | T>
    mergeExpression(parsedExpression: ParsedExpression, clear: boolean): Second
    getAllCallbacksFor(second: string, minute: string, hour: string, day: string, dayOfTheWeek: string, month: string, year: string): (() => Promise<void>)[]
}

const dayOfTheWeekMap = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
] as const

export const makeCronClient = (): ICronClient => {
    const self: Self = {
        crons: {
            second: {}
        }
    } as Self
    self.run = run(self)
    self.parseExpression = parseExpression(self)
    self.parseRangeExpression = parseRangeExpression(self)
    self.mergeExpression = mergeExpression(self)
    self.getAllCallbacksFor = getAllCallbacksFor(self)

    self.run()

    return {
        schedule: schedule(self),
        unschedule: unschedule(self)
    }
}

const run = (self: Self): Self['run'] => () => {
    setInterval(async () => {
        const now = new Date()
        const second = String(now.getUTCSeconds())
        const minute = String(now.getUTCMinutes())
        const hour = String(now.getUTCHours())
        const day = String(now.getUTCDate())
        const dayOfTheWeek = String(now.getUTCDay())
        const month = String(now.getUTCMonth() + 1)
        const year = String(now.getUTCFullYear())

        const callbacks = self.getAllCallbacksFor(second, minute, hour, day, dayOfTheWeek, month, year)

        for (const callback of callbacks) {
            await callback()
        }
    }, 1000)
}

const parseExpression = (self: Self): Self['parseExpression'] => (expression, callback) => {
    let [seconds, minutes, hours, days, dayOfTheWeeks, months, years] = expression.split(' ');
    seconds ||= '*'
    minutes ||= '*'
    hours ||= '*'
    days ||= '*'
    dayOfTheWeeks ||= '*'
    months ||= '*'
    years ||= '*'

    const secondsSet = self.parseRangeExpression(seconds, 0, 59, (value) => Number(value), (value) => String(value))
    const minutesSet = self.parseRangeExpression(minutes, 0, 59, (value) => Number(value), (value) => String(value))
    const hoursSet = self.parseRangeExpression(hours, 0, 23, (value) => Number(value), (value) => String(value))
    const daysSet = self.parseRangeExpression(hours, 0, 31, (value) => Number(value), (value) => String(value))
    const dayOfTheWeeksSet = self.parseRangeExpression(hours, 0, 6, (value) => dayOfTheWeekMap.indexOf(value as any), (value) => String(value % 7))
    const monthsSet = self.parseRangeExpression(months, 0, 11, (value) => Number(value), (value) => String(value))
    const yearsSet = self.parseRangeExpression(years, 0, 9999, (value) => Number(value), (value) => String(value))

    return {
        secondsSet,
        minutesSet,
        hoursSet,
        daysSet,
        dayOfTheWeeksSet,
        monthsSet,
        yearsSet,
        callback
    }
}

const parseRangeExpression = (_self: Self): Self['parseRangeExpression'] => <T>(expression: string, lowerLimit: number, upperLimit: number, valueMapper: (value: string) => number, valueUnMapper: (value: number) => T) => {
    const result = new Set<'*' | T>()

    expression.split(',').forEach(subExpression => {
        if (subExpression === '?') {
            result.add('*')
            return
        }

        if (subExpression === '*') {
            result.add('*')
            return
        }

        if (subExpression.includes('-')) {
            const [start, end] = subExpression.split('-').map(entry => valueMapper(entry))

            if (start === undefined || Number.isNaN(start) || start < lowerLimit || start > upperLimit || end === undefined || Number.isNaN(end) || end < lowerLimit || end > upperLimit || start >= end) {
                throw new Error(`Wrong cron expression: ${expression}`)
            }

            for (let i = start; i < end; i++) {
                result.add(valueUnMapper(i))
            }

            return
        }

        if (subExpression.includes('/')) {
            const [start, increment] = subExpression.split('/').map(entry => valueMapper(entry))

            if (start === undefined || Number.isNaN(start) || start < lowerLimit || start > upperLimit || increment === undefined || Number.isNaN(increment) || increment < lowerLimit || increment > upperLimit || start >= increment) {
                throw new Error(`Wrong cron expression: ${expression}`)
            }

            for (let i = start; i < upperLimit; i += increment) {
                result.add(valueUnMapper(i))
            }

            return
        }
    })

    return result
}


const mergeExpression = (self: Self): Self['mergeExpression'] => (parsedExpression, clear) => {
    // TODO: Would've written this differently, but I had no time.
    for (const second of parsedExpression.secondsSet) {
        const secondExpression = self.crons.second

        if (!(second in secondExpression)) {
            secondExpression[second] = {
                minute: {}
            }
        }

        for (const minute of parsedExpression.minutesSet) {
            const minuteExpression = secondExpression[second]!.minute
    
            if (!(minute in minuteExpression)) {
                minuteExpression[minute] = {
                    hour: {}
                }
            }

            for (const hour of parsedExpression.hoursSet) {
                const hourExpression = minuteExpression[minute]!.hour
        
                if (!(hour in hourExpression)) {
                    hourExpression[hour] = {
                        day: {}
                    }
                }

                for (const day of parsedExpression.daysSet) {
                    const dayExpression = hourExpression[minute]!.day
            
                    if (!(day in dayExpression)) {
                        dayExpression[day] = {
                            dayOfTheWeek: {}
                        }
                    }

                    for (const dayOfTheWeek of parsedExpression.dayOfTheWeeksSet) {
                        const dayOfTheWeekExpression = dayExpression[dayOfTheWeek]!.dayOfTheWeek
                
                        if (!(dayOfTheWeek in dayOfTheWeekExpression)) {
                            dayOfTheWeekExpression[dayOfTheWeek] = {
                                month: {}
                            }
                        }

                        for (const month of parsedExpression.monthsSet) {
                            const monthExpression = dayOfTheWeekExpression[month]!.month
                    
                            if (!(month in monthExpression)) {
                                monthExpression[month] = {
                                    year: {}
                                }
                            }

                            for (const year of parsedExpression.yearsSet) {
                                const yearExpression = monthExpression[year]!.year
                        
                                if (!(year in yearExpression)) {
                                    yearExpression[year] = []
                                }

                                if (!clear) {
                                    yearExpression[year]!.push(parsedExpression.callback)
                                    continue
                                }

                                const index = yearExpression[year]!.findIndex(entry => entry === parsedExpression.callback) || -1
                                
                                if (index === -1) {
                                    continue
                                }

                                yearExpression[year]!.splice(index, 1)
                            }
                        }
                    }
                }
            }
        }
    }

    return self.crons
}

const getAllCallbacksFor = (self: Self): Self['getAllCallbacksFor'] => (second: string, minute: string, hour: string, day: string, dayOfTheWeek: string, month: string, year: string) => {
    const results = []
    const parents: any[] = [self.crons.second]
    const queue = [second, minute, hour, day, dayOfTheWeek, month, year]

    while (queue.length > 0) {
        const value = queue.shift()!
        
        while (parents.length > 0) {
            const parent = parents.shift()!
            const elements = [parent[value], parent['*']]

            for (const element of elements) {
                if (!element) {
                    continue
                }
                
                if (Array.isArray(element) && element.every(entry => typeof entry === 'function')) {
                    results.push(...element)
                    continue
                }

                parents.push(element[Object.keys(element)[0] as any])
            }
        }
    }

    return results
}

const schedule = (self: Self): ICronClient['schedule'] => (expression, callback) => {
    const parsedExpression = self.parseExpression(expression, callback)
    const mergedExpression = self.mergeExpression(parsedExpression, false)
    
    self.crons = mergedExpression
}

const unschedule = (self: Self): ICronClient['unschedule'] => (expression, callback) => {
    const parsedExpression = self.parseExpression(expression, callback)
    const mergedExpression = self.mergeExpression(parsedExpression, true)
    
    self.crons = mergedExpression
}
