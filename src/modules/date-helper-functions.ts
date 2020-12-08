export const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

export const getTimeOfDay = (date: Date): Date => {
    const dateString = `01 Jan 1970 ${date.getHours()}:${date.getMinutes()}:00`;
    return new Date(dateString);
}

// number of milliseconds in one day
var millisecondsInOneDay = 24 * 60 * 60 * 1000;

export const elapsedDays = (startDate: Date, endDate: Date): number => {

    // strip the time from the dates
    let start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.round(Math.abs((end.getTime() - start.getTime()) / millisecondsInOneDay));
}