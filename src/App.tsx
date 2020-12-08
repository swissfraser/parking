import React, { useState } from 'react';
import './App.css';
import DateTimePicker from 'react-datetime-picker';
import { calculateCharge, ChargeType } from './modules/parking-calculator';

function App() {

  const [arrivalTime, onChangeArrivalTime] = useState<Date>(new Date());
  const [departureTime, onChangeDepartureTime] = useState<Date>(new Date());
  const [chargeType, onChangeChargeType] = useState<ChargeType>('short');
  const [result, setResult] = useState<string>('Press Calculate button');

  const onCalculate = (): void => {
    try {
      const charge = calculateCharge(arrivalTime, departureTime, chargeType);
      const chargeInPounds =  `£${(charge / 100).toFixed(2)}p`;
      setResult(chargeInPounds);
    } catch (error) {
      setResult(error);
    }
    

  }

  return (
    <div id="app">
      <header id="app-header">
        Parking Calculator
      </header>
      <div id='app-container'>

        <div className='input-container'>
          <div className='label'>Charge Type</div>
          <select className='control' value={chargeType} name="charge-type" id="select-charge-type" onChange={(event) => onChangeChargeType(event.target.value as ChargeType)}>
            <option value="short">Short</option>ß
            <option value="long">Long</option>
          </select>
        </div>

        <div className='input-container'>
          <div className='label'>Arrival Time</div>
          <DateTimePicker
            name='arrival-time'
            className='control'
            onChange={onChangeArrivalTime}
            value={arrivalTime}
            locale={'GMT'}
          />
        </div>

        <div className='input-container'>
          <div className='label'>Departure Time</div>
          <DateTimePicker
            name='departure-time'
            className='control'
            onChange={onChangeDepartureTime}
            value={departureTime}
            locale={'GMT'}
          />
        </div>

        <div className='input-container'>
          <div className='label'>Calculate Charge</div>
          <button className='control' onClick={onCalculate}>Calculate</button>
        </div>

        <div className='input-container'>
          <div className='label'>Parking charge</div>
          {result}
        </div>
      </div>
    </div>
  );
}

export default App;
