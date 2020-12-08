import {getTimeOfDay,  isWeekend}  from './date-helper-functions'


const nineAmMonday = new Date('07 Dec 2020 09:00:00 GMT');
const fourPmMonday = new Date('07 Dec 2020 16:00:00 GMT');

const nineAmTuesday = new Date('08 Dec 2020 09:00:00 GMT');
const fourPmTuesday = new Date('08 Dec 2020 16:00:00 GMT');

const fourPmSaturday = new Date('12 Dec 2020 16:00:00 GMT');
const twelvePmSunday = new Date('13 Dec 2020 12:00:00 GMT');

describe('it tests the getTime function', () => {

    test('it checks nine am on a monday', () => {
        const nineAm = getTimeOfDay(nineAmMonday);
        expect(nineAm.getHours()).toEqual(9);
        expect(nineAm.getMinutes()).toEqual(0);
    });

    test('it checks four pm on a tuesday', () => {
        const nineAm = getTimeOfDay(fourPmTuesday);
        expect(nineAm.getHours()).toEqual(16);
        expect(nineAm.getMinutes()).toEqual(0);
    });
});


describe('it tests the weekend checker', () => {

    test('it checks if monday is on a weekend', () => {
        const weekend = isWeekend(nineAmMonday);
        expect(weekend).toEqual(false);
    });

    test('it checks if sunday is on a weekend', () => {
        const weekend = isWeekend(twelvePmSunday);
        expect(weekend).toEqual(true);
    });

    test('it checks if saturday is on a weekend', () => {
        const weekend = isWeekend(fourPmSaturday);
        expect(weekend).toEqual(true);
    });
});