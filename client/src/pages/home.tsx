import React, { useEffect, useState } from 'react';

import './home.css';

const MoneyCounter = () => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [dailyRate, setDailyRate] = useState(100);
    const [money, setMoney] = useState(0);
    const [prevMoney, setPrevMoney] = useState(0);
    const [changedIndices, setChangedIndices] = useState<number[]>([]);
    const [isWorking, setIsWorking] = useState(false);

    // Convert time string to minutes since midnight
    const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Calculate money earned per second
    const calculateMoneyPerSecond = () => {
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const workMinutes = endMinutes - startMinutes;
        const moneyPerSecond = (dailyRate / workMinutes) / 60;
        return moneyPerSecond;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentMinutes = currentHour * 60 + currentMinute;
            
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);

            // Check if we're within working hours
            const shouldBeWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;
            
            if (shouldBeWorking && !isWorking) {
                setIsWorking(true);
            } else if (!shouldBeWorking && isWorking) {
                setIsWorking(false);
            }

            if (isWorking) {
                const moneyPerSecond = calculateMoneyPerSecond();
                const nextMoney = money + moneyPerSecond;
                
                // Calculate which digits will change
                const nextMoneyStr = nextMoney.toFixed(2).padStart(maxLength, '0');
                const currentMoneyStr = money.toFixed(2).padStart(maxLength, '0');
                
                const changed: number[] = [];
                for (let i = 0; i < maxLength; i++) {
                    if (nextMoneyStr[i] !== currentMoneyStr[i]) {
                        changed.push(i);
                    }
                }
                
                setChangedIndices(changed);
                setPrevMoney(money);
                setMoney(nextMoney);
                
                setTimeout(() => {
                    setChangedIndices([]);
                }, 500);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [money, startTime, endTime, dailyRate, isWorking]);

    // Convert numbers to strings to process digit by digit
    const moneyStr = money.toFixed(2);
    const prevMoneyStr = prevMoney.toFixed(2);
    
    // Pad with zeros to equal length if needed
    const maxLength = Math.max(moneyStr.length, prevMoneyStr.length);
    const paddedMoney = moneyStr.padStart(maxLength, '0');
    const paddedPrevMoney = prevMoneyStr.padStart(maxLength, '0');

    return (
        <div className="money-counter">
            <div className="inputs">
                <div className="input-group">
                    <label>Start Time:</label>
                    <input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>End Time:</label>
                    <input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Daily Rate (€):</label>
                    <input 
                        type="number" 
                        value={dailyRate} 
                        onChange={(e) => setDailyRate(Number(e.target.value))}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div className="money-display">
                <span className="currency">€</span>
                <h1 className="time-container">
                    {paddedMoney.split('').map((digit, index) => {
                        const didChange = changedIndices.includes(index);
                        const prevDigit = paddedPrevMoney[index];
                        
                        return (
                            <div 
                                key={`${index}-${money}`} 
                                className={`digit ${didChange ? 'changed' : ''}`}
                            >
                                {didChange ? (
                                    <>
                                        <div className="digit-old">{prevDigit}</div>
                                        <div className="digit-new">{digit}</div>
                                    </>
                                ) : (
                                    <div className="digit-static">{digit}</div>
                                )}
                            </div>
                        );
                    })}
                </h1>
            </div>
            <div className="status">
                {isWorking ? 'Currently Working' : 'Not Working'}
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <div>
            <h1>Money Counter</h1>
            <MoneyCounter />
        </div>
    );
};

export default Home;

