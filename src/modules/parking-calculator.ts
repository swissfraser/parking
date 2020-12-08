import { getTimeOfDay, isWeekend, elapsedDays } from './date-helper-functions'

export type ChargeType = 'short' | 'long';

export const parkingCalculatorConfig = {
    longStayCostPerDay: 750,
    shortStayCostPerHour: 110,
    shortStayPerMinute: 110 / 60,
    openingTime: new Date('01 Jan 1970 08:00:00'),
    closingTime: new Date('01 Jan 1970 18:00:00')
};

export const calculateCharge = (arrival: Date, departure: Date, chargeType: ChargeType): number => {

    if (departure < arrival) {
        throw new Error("Departure date must be after arrival date.");
    }

    if (chargeType === 'long') {
        return calculateLongStayCost(arrival, departure);
    } else {
        return calculateShortStayCost(arrival, departure);
    }
}

const calculateLongStayCost = (arrival: Date, departure: Date): number => {
    const days = calculateChargeableDays(arrival, departure);
    return days * parkingCalculatorConfig.longStayCostPerDay;
}

const calculateShortStayCost = (arrival: Date, departure: Date): number => {

    const arrivalDayCost = getArrivalDayCost(arrival, departure);
    const departureDayCost = getDepartureDayCost(arrival, departure);
    const fullDaysCost = getCostPerFullDaysStayed(arrival, departure);
    return Math.floor(arrivalDayCost + departureDayCost + fullDaysCost);
}

export const calculateChargeableDays = (startDate: Date, endDate: Date): number => {
    let elapsed = elapsedDays(startDate, endDate);
    // we have to pay for the day we arrived, regardless of when we leave
    return elapsed + 1;
}

export const isAfterHours = (date: Date): boolean => (getTimeOfDay(date) > parkingCalculatorConfig.closingTime);

export const isBeforeHours = (date: Date): boolean => (getTimeOfDay(date) < parkingCalculatorConfig.openingTime);

export const getArrivalDayCost = (arrival: Date, departure: Date): number => {

    // no cost if we arrive on the weekend
    if (isWeekend(arrival)) return 0;

    // no cost if we arrive after hours
    if (isAfterHours(arrival)) return 0;

    // set maximum billable time for the day to parking closing time
    let lastBillableTimeInMilliseconds = parkingCalculatorConfig.closingTime.getTime();

    if (elapsedDays(arrival, departure) === 0) {
        // check we dont arrive and leave again before opening time
        if (isBeforeHours(departure)) return 0;

        // use actual departure time as the end time
        lastBillableTimeInMilliseconds = Math.min(lastBillableTimeInMilliseconds, getTimeOfDay(departure).getTime());
    }

    // charge the customer for every minute they park during opening hours
    const startBillableTimeMilliseconds = Math.max(parkingCalculatorConfig.openingTime.getTime(), getTimeOfDay(arrival).getTime());
    const millisecondsElapsed = lastBillableTimeInMilliseconds - startBillableTimeMilliseconds;
    const minutes = (millisecondsElapsed / 1000) / 60;

    return minutes * parkingCalculatorConfig.shortStayPerMinute;
}

export const getDepartureDayCost = (arrival: Date, departure: Date): number => {

    // if it's same day as arrival, we already did the calculation
    if (elapsedDays(arrival, departure) === 0) {
        return 0;
    }

    // no cost if we leave during the weekend weekend
    if (isWeekend(departure)) return 0;

    // no cost if we leave before opening hours
    if (isBeforeHours(departure)) return 0;

    // set maximum billable time for the day to parking closing time
    let lastBillableTimeInMilliseconds = Math.min(parkingCalculatorConfig.closingTime.getTime(), getTimeOfDay(departure).getTime());

    // charge the customer for every minute they park during opening hours
    const millisecondsElapsed = lastBillableTimeInMilliseconds - parkingCalculatorConfig.openingTime.getTime();
    const minutes = (millisecondsElapsed / 1000) / 60;

    return minutes * parkingCalculatorConfig.shortStayPerMinute;
}

export const getShortStayCostPerDay = (): number => {
    const millisecondsInParkingHours = parkingCalculatorConfig.closingTime.getTime() - parkingCalculatorConfig.openingTime.getTime();
    const minutesInParkingHours = (millisecondsInParkingHours / 1000) / 60;
    const costPerDay = minutesInParkingHours * parkingCalculatorConfig.shortStayPerMinute;
    return costPerDay;

}

export const getCostPerFullDaysStayed = (arrival: Date, departure: Date): number => {
    const elapsed = elapsedDays(arrival, departure);

    let totalCost = 0;
    const shortStayCostPerDay = getShortStayCostPerDay();

    for (let dayOffset = 1; dayOffset < elapsed; dayOffset++) {
        const parkedDay = new Date();
        parkedDay.setDate(arrival.getDate() + dayOffset);
        if (!isWeekend(parkedDay)) {
            totalCost += shortStayCostPerDay;
        }
    }
    return totalCost;

}

