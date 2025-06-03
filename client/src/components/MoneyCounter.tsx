import React, { useEffect, useState } from 'react';

const TimeCounter = () => {
    const [time, setTime] = useState(new Date());
    const [prevTime, setPrevTime] = useState(new Date());
    const [changedIndices, setChangedIndices] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = new Date();
            setPrevTime(time);
            setTime(newTime);
            
            // Calculate which digits changed
            const timeStr = newTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const prevTimeStr = time.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const changed: number[] = [];
            for (let i = 0; i < timeStr.length; i++) {
                if (timeStr[i] !== prevTimeStr[i]) {
                    changed.push(i);
                }
            }
            
            setChangedIndices(changed);
            
            setTimeout(() => {
                setChangedIndices([]);
            }, 500);
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    const timeStr = time.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const prevTimeStr = prevTime.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <div className="time-counter">
            <div className="time-display">
                {timeStr.split('').map((digit, index) => {
                    const didChange = changedIndices.includes(index);
                    const prevDigit = prevTimeStr[index];
                    
                    return (
                        <div 
                            key={`${index}-${time}`} 
                            className={`digit ${didChange ? 'changed' : ''} ${digit === ':' ? 'colon' : ''}`}
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
            </div>
        </div>
    );
};

interface MoneyCounterProps {
    startTime?: Date;
    endTime?: Date;
    hourlyWage?: number;
    showControls?: boolean;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ 
    startTime: propStartTime, 
    endTime: propEndTime, 
    hourlyWage: propHourlyWage = 25,
    showControls = false 
}) => {
    // Convert Date props to time strings, or use defaults
    const getTimeString = (date?: Date) => {
        if (!date) return '';
        return date.toTimeString().slice(0, 5); // HH:MM format
    };

    const [startTime, setStartTime] = useState(
        propStartTime ? getTimeString(propStartTime) : '09:00'
    );
    const [endTime, setEndTime] = useState(
        propEndTime ? getTimeString(propEndTime) : '17:00'
    );
    const [dailyRate, setDailyRate] = useState(propHourlyWage * 8); // Convert hourly to daily rate
    const [money, setMoney] = useState(0);
    const [prevMoney, setPrevMoney] = useState(0);
    const [changedIndices, setChangedIndices] = useState<number[]>([]);
    const [isWorking, setIsWorking] = useState(false);

    // Update state when props change
    useEffect(() => {
        if (propStartTime) {
            setStartTime(getTimeString(propStartTime));
        }
        if (propEndTime) {
            setEndTime(getTimeString(propEndTime));
        }
        if (propHourlyWage) {
            setDailyRate(propHourlyWage * 8); // Assuming 8 hour work day
        }
    }, [propStartTime, propEndTime, propHourlyWage]);

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

    // Calculate money earned so far today
    const calculateMoneyEarnedToday = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSeconds = now.getSeconds();
        const currentMinutes = currentHour * 60 + currentMinute;
        
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        // If we haven't started working yet today
        if (currentMinutes < startMinutes) {
            return 0;
        }

        // If we're past working hours
        if (currentMinutes >= endMinutes) {
            const workMinutes = endMinutes - startMinutes;
            return (dailyRate / workMinutes) * workMinutes;
        }

        // If we're currently working
        const minutesWorked = currentMinutes - startMinutes;
        const secondsWorked = currentSeconds;
        const totalSecondsWorked = minutesWorked * 60 + secondsWorked;
        const moneyPerSecond = calculateMoneyPerSecond();
        
        return moneyPerSecond * totalSecondsWorked;
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

            const currentMoney = calculateMoneyEarnedToday();
            const nextMoney = currentMoney + (isWorking ? calculateMoneyPerSecond() : 0);
            
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
        }, 1000);

        return () => clearInterval(interval);
    }, [money, startTime, endTime, dailyRate, isWorking]);

    // Convert numbers to strings to process digit by digit
    const moneyStr = money.toFixed(2);
    const prevMoneyStr = prevMoney.toFixed(2);
    
    // Pad with zeros to equal length if needed
    const maxLength = Math.max(moneyStr.length, prevMoneyStr.length);
    const paddedMoney = moneyStr.padStart(maxLength, '0');
    const paddedPrevMoney = prevMoneyStr.padStart(maxLength, '0');    return (
        <div className="money-counter">
            {showControls && (
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
            )}

            <div className="money-display">
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
                <span className="currency">€</span>
            </div>

            <TimeCounter />
            
            <div className="status">
                {isWorking ? 'Currently Working' : 'Not Working'}
            </div>
        </div>
    );
};

export default MoneyCounter;

