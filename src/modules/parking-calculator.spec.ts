import {
    calculateCharge,
    calculateChargeableDays,
    getArrivalDayCost,
    getCostPerFullDaysStayed,
    getDepartureDayCost,
    getShortStayCostPerDay,
    parkingCalculatorConfig
} from './parking-calculator'

const sixAmMonday = new Date('07 Dec 2020 06:00:00');
const nineAmMonday = new Date('07 Dec 2020 09:00:00');
const fourPmMonday = new Date('07 Dec 2020 16:00:00');
const ninePmMonday = new Date('07 Dec 2020 21:00:00');

const nineAmTuesday = new Date('08 Dec 2020 09:00:00');
const fourPmTuesday = new Date('08 Dec 2020 16:00:00');
const sixPmTuesday = new Date('08 Dec 2020 18:00:00');

const sixPmFriday = new Date('11 Dec 2020 19:00:00');

const fourPmSaturday = new Date('12 Dec 2020 16:00:00');
const twelvePmSunday = new Date('13 Dec 2020 12:00:00');
const tenPmSunday = new Date('13 Dec 2020 22:00:00');

describe('it tests the chargeable day calculator', () => {

    test('it calculates the number of chargeable days for a same day departure', () => {
        const days = calculateChargeableDays(nineAmMonday, fourPmMonday);
        expect(days).toEqual(1);
    });

    test('it calculates the number of chargeable days from monday morning to tuesday morning', () => {
        const days = calculateChargeableDays(nineAmMonday, nineAmTuesday);
        expect(days).toEqual(2);
    });

    test('it calculates the number of chargeable days from monday morning to tuesday evening', () => {
        const days = calculateChargeableDays(nineAmMonday, fourPmTuesday);
        expect(days).toEqual(2);
    });

    test('it calculates the number of chargeable days from monday afternoon to tuesday morning', () => {
        const days = calculateChargeableDays(fourPmMonday, nineAmTuesday);
        expect(days).toEqual(2);
    });

    test('it calculates the number of chargeable days if we leave before we arrive', () => {
        const days = calculateChargeableDays(fourPmMonday, nineAmMonday);
        // the function will always return at least one day
        expect(days).toEqual(1);
    });

});

describe('it tests the long stay calculator', () => {

    test('it calculates the price for a one day stay', () => {
        const cost = calculateCharge(nineAmMonday, fourPmMonday, 'long');
        expect(cost).toEqual(parkingCalculatorConfig.longStayCostPerDay);
    });

    test('it calculates the price for a two day stay', () => {
        const cost = calculateCharge(nineAmMonday, nineAmTuesday, 'long');
        expect(cost).toEqual(parkingCalculatorConfig.longStayCostPerDay * 2);
    });

    test('it calculates the price from monday til sunday', () => {
        const cost = calculateCharge(nineAmMonday, twelvePmSunday, 'long');
        expect(cost).toEqual(parkingCalculatorConfig.longStayCostPerDay * 7);
    });

    test('it calculates the price if we leave before we arrive', () => {
        expect(() => calculateCharge(nineAmTuesday, nineAmMonday, 'long')).toThrowError('Departure date must be after arrival date.')
    });

});


describe('it tests the arrival date costs', () => {

    test('it checks an arrival time before closing gets billed', () => {
        const cost = getArrivalDayCost(sixAmMonday, fourPmTuesday);
        expect(cost).toEqual(10 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks an arrival time during opening hours', () => {
        const cost = getArrivalDayCost(fourPmMonday, fourPmTuesday);
        expect(cost).toEqual(2 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks an arrival time during opening hours and a departure during hours', () => {
        const cost = getArrivalDayCost(nineAmMonday, fourPmMonday);
        expect(cost).toEqual(7 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks the costs arriving on a weekend', () => {
        const cost = getArrivalDayCost(fourPmSaturday, fourPmTuesday);
        expect(cost).toEqual(0);
    });

    test('it checks the costs arriving after closing', () => {
        const cost = getArrivalDayCost(ninePmMonday, fourPmTuesday);
        expect(cost).toEqual(0);
    });

});

describe('it tests the departure date costs', () => {

    test('it checks an departure time before closing gets billed', () => {
        const cost = getDepartureDayCost(sixAmMonday, fourPmTuesday);
        expect(cost).toEqual(8 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks an departure time during opening hours', () => {
        const cost = getDepartureDayCost(fourPmMonday, fourPmTuesday);
        expect(cost).toEqual(8 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks an departure time during opening hours and a departure during hours', () => {
        const cost = getDepartureDayCost(nineAmMonday, fourPmMonday);
        expect(cost).toEqual(0);
    });

    test('it checks the costs departure on a weekend', () => {
        const cost = getDepartureDayCost(sixAmMonday, fourPmSaturday);
        expect(cost).toEqual(0);
    });

    test('it checks the costs when departure is during hours', () => {
        const cost = getDepartureDayCost(ninePmMonday, nineAmTuesday);
        expect(cost).toEqual(1 * parkingCalculatorConfig.shortStayCostPerHour);
    });

});

describe('it tests the full days parked calculator', () => {

    test('it checks full days for same day departure', () => {
        const cost = getCostPerFullDaysStayed(sixAmMonday, ninePmMonday);
        expect(cost).toEqual(0);
    });

    test('it checks full days for next day departure', () => {
        const cost = getCostPerFullDaysStayed(sixAmMonday, fourPmTuesday);
        expect(cost).toEqual(0);
    });

    test('it checks full days for monday to following sunday departure', () => {
        const cost = getCostPerFullDaysStayed(sixAmMonday, twelvePmSunday);

        // full days tues,wed,thurs and friday
        expect(cost).toEqual(4 * getShortStayCostPerDay());
    });
});


describe('it test the short stay calculator', () => {

    test('it checks cost for a stay outside chargeable period ', () => {
        const cost = calculateCharge(sixPmFriday, tenPmSunday, 'short');
        expect(cost).toEqual(0);
    });

    test('it checks cost for an overnight stay for full chargeable period', () => {
        const cost = calculateCharge(sixAmMonday, sixPmTuesday, 'short');
        expect(cost).toEqual(2 * getShortStayCostPerDay());
    });

    test('it checks cost for a same day stay arriving before chargeable hours', () => {
        const cost = calculateCharge(sixAmMonday, fourPmMonday, 'short');
        expect(cost).toEqual(8 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks cost for a same day stay within chargeable hours', () => {
        const cost = calculateCharge(nineAmMonday, fourPmMonday, 'short');
        expect(cost).toEqual(7 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks cost for a same day stay leaving after chargeable hours', () => {
        const cost = calculateCharge(sixAmMonday, ninePmMonday, 'short');
        expect(cost).toEqual(10 * parkingCalculatorConfig.shortStayCostPerHour);
    });

    test('it checks cost for a stay from monday to sunday', () => {
        const cost = calculateCharge(sixAmMonday, tenPmSunday, 'short');
        expect(cost).toEqual(5 * getShortStayCostPerDay());
    });
});

describe('test the examples given in the challenge!', () => {

    test('it checks A short stay from 07/09/2017 16:50:00 to 09/09/2017 19:15:00 would cost £12.28', () => {

        const start = new Date('07 Sep 2017 16:50:00');
        const end = new Date('09 Sep 2017 20:15:00');

        const cost = calculateCharge(start, end, 'short');
        expect(cost).toEqual(1228);
    });


    test('it checks A long stay from 07/09/2017 07:50:00 to 09/09/2017 05:20:00 would cost £22.50', () => {

        const start = new Date('07 Sep 2017 07:50:00');
        const end = new Date('09 Sep 2017 05:20:00');
        const cost = calculateCharge(start, end, 'long');
        expect(cost).toEqual(2250);
    });

})


