import React, { useState, useRef, useCallback } from 'react';
import './TimeCircle.css'; // Import the CSS file

const TimeCircle = () => {
  const [startAngle, setStartAngle] = useState(315); // 21:00 (9 PM)
  const [endAngle, setEndAngle] = useState(135); // 07:00 (7 AM)
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const svgRef = useRef(null);

  const radius = 140;
  const centerX = 160;
  const centerY = 160;
  const handleRadius = 8;

  // Convert angle to time (0° = 12:00)
  const angleToTime = (angle) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const totalMinutes = (normalizedAngle / 360) * 24 * 60;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = Math.round(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Convert time string to angle
  const timeToAngle = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 360;
  };

  // Convert polar coordinates to cartesian
  const polarToCartesian = (angle) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  // Convert mouse position to angle
  const mouseToAngle = (clientX, clientY) => {
    if (!svgRef.current) return 0;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    return ((angle % 360) + 360) % 360;
  };

  // Handle time input changes
  const handleTimeInputChange = (type, value) => {
    if (type === 'start') {
      setStartTimeInput(value);
    } else {
      setEndTimeInput(value);
    }
  };

  const handleTimeInputBlur = (type, value) => {
    if (value.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const angle = timeToAngle(value);
        if (type === 'start') {
          setStartAngle(angle);
          setStartTimeInput('');
        } else {
          setEndAngle(angle);
          setEndTimeInput('');
        }
      }
    }
    // Reset input if invalid
    if (type === 'start') {
      setStartTimeInput('');
    } else {
      setEndTimeInput('');
    }
  };

  const handleTimeInputKeyPress = (type, e, value) => {
    if (e.key === 'Enter') {
      handleTimeInputBlur(type, value);
    }
  };

  // Create arc path
  const createArcPath = (start, end) => {
    const startPoint = polarToCartesian(start);
    const endPoint = polarToCartesian(end);
    
    // Calculate if we need the large arc flag
    let angleDiff = end - start;
    if (angleDiff < 0) angleDiff += 360;
    const largeArc = angleDiff > 180 ? 1 : 0;
    
    return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
  };

  // Handle mouse events
  const handleMouseDown = (type) => (e) => {
    e.preventDefault();
    if (type === 'arc') {
      // For arc dragging, store the initial angle difference
      const currentAngle = mouseToAngle(e.clientX, e.clientY);
      setDragOffset(currentAngle);
    }
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const angle = mouseToAngle(e.clientX, e.clientY);
    
    if (isDragging === 'start') {
      setStartAngle(angle);
    } else if (isDragging === 'end') {
      setEndAngle(angle);
    } else if (isDragging === 'arc') {
      // Move both angles by the same amount
      const angleDiff = angle - dragOffset;
      setStartAngle(prev => prev + angleDiff);
      setEndAngle(prev => prev + angleDiff);
      setDragOffset(angle);
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle touch events
  const handleTouchStart = (type) => (e) => {
    e.preventDefault();
    if (type === 'arc' && e.touches[0]) {
      const currentAngle = mouseToAngle(e.touches[0].clientX, e.touches[0].clientY);
      setDragOffset(currentAngle);
    }
    setIsDragging(type);
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !e.touches[0]) return;
    
    const angle = mouseToAngle(e.touches[0].clientX, e.touches[0].clientY);
    
    if (isDragging === 'start') {
      setStartAngle(angle);
    } else if (isDragging === 'end') {
      setEndAngle(angle);
    } else if (isDragging === 'arc') {
      const angleDiff = angle - dragOffset;
      setStartAngle(prev => prev + angleDiff);
      setEndAngle(prev => prev + angleDiff);
      setDragOffset(angle);
    }
  }, [isDragging, dragOffset]);

  // Generate hour markers
  const hourMarkers = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15) - 90; // 360/24 = 15 degrees per hour
    const radian = angle * (Math.PI / 180);
    const isMainHour = i % 6 === 0;
    const markerRadius = isMainHour ? radius + 15 : radius + 10;
    const innerRadius = radius - 5;
    
    const x1 = centerX + innerRadius * Math.cos(radian);
    const y1 = centerY + innerRadius * Math.sin(radian);
    const x2 = centerX + markerRadius * Math.cos(radian);
    const y2 = centerY + markerRadius * Math.sin(radian);
    
    return (
      <g key={i}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={isMainHour ? "hour-marker-main" : "hour-marker-minor"}
        />
        {isMainHour && (
          <text
            x={centerX + (markerRadius + 15) * Math.cos(radian)}
            y={centerY + (markerRadius + 15) * Math.sin(radian)}
            className="hour-number-outer"
          >
            {i === 0 ? '12' : i}
          </text>
        )}
      </g>
    );
  });

  // Generate inner hour numbers
  const innerHourNumbers = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    const angle = (i * 30) - 90; // 360/12 = 30 degrees per hour
    const radian = angle * (Math.PI / 180);
    const numberRadius = radius - 35;
    
    const x = centerX + numberRadius * Math.cos(radian);
    const y = centerY + numberRadius * Math.sin(radian);
    
    return (
      <text
        key={i}
        x={x}
        y={y}
        className="hour-number-inner"
      >
        {hour}
      </text>
    );
  });

  const startPoint = polarToCartesian(startAngle);
  const endPoint = polarToCartesian(endAngle);

  return (
    <div className="sleep-timer-container">
      <div className="sleep-timer-header">
        <h1 className="sleep-timer-title">Sleep Schedule</h1>
        <div className="time-inputs-container">
          <div className="time-input-group">
            <div className="time-input-label">Bedtime</div>
            <input
              type="text"
              value={startTimeInput || angleToTime(startAngle)}
              onChange={(e) => handleTimeInputChange('start', e.target.value)}
              onBlur={(e) => handleTimeInputBlur('start', e.target.value)}
              onKeyPress={(e) => handleTimeInputKeyPress('start', e, e.target.value)}
              placeholder="HH:MM"
              pattern="[0-2][0-9]:[0-5][0-9]"
              className="time-input-field"
            />
          </div>
          <div className="time-input-group">
            <div className="time-input-label">Wake Up</div>
            <input
              type="text"
              value={endTimeInput || angleToTime(endAngle)}
              onChange={(e) => handleTimeInputChange('end', e.target.value)}
              onBlur={(e) => handleTimeInputBlur('end', e.target.value)}
              onKeyPress={(e) => handleTimeInputKeyPress('end', e, e.target.value)}
              placeholder="HH:MM"
              pattern="[0-2][0-9]:[0-5][0-9]"
              className="time-input-field"
            />
          </div>
        </div>
      </div>

      <div className="clock-container">
        <svg
          ref={svgRef}
          width="320"
          height="320"
          className="clock-svg"
          style={{ touchAction: 'none' }}
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            className="background-circle"
          />
          
          {/* Hour markers */}
          {hourMarkers}
          
          {/* Inner hour numbers */}
          {innerHourNumbers}
          
          {/* Sleep duration arc */}
          <path
            d={createArcPath(startAngle, endAngle)}
            className={`sleep-arc ${isDragging === 'arc' ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown('arc')}
            onTouchStart={handleTouchStart('arc')}
          />
          
          {/* Start handle (bedtime) */}
          <circle
            cx={startPoint.x}
            cy={startPoint.y}
            r={handleRadius}
            className={`sleep-handle ${isDragging === 'start' ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown('start')}
            onTouchStart={handleTouchStart('start')}
          />
          
          {/* End handle (wake up) */}
          <circle
            cx={endPoint.x}
            cy={endPoint.y}
            r={handleRadius}
            className={`sleep-handle ${isDragging === 'end' ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown('end')}
            onTouchStart={handleTouchStart('end')}
          />
          
          {/* Center decoration */}
          <circle
            cx={centerX}
            cy={centerY}
            r="6"
            className="center-dot"
          />
        </svg>
      </div>
      
      <div className="duration-section">
        <div className="duration-label">Sleep Duration</div>
        <div className="duration-value">
          {(() => {
            let duration = endAngle - startAngle;
            if (duration < 0) duration += 360;
            const totalMinutes = Math.round((duration / 360) * 24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
          })()}
        </div>
      </div>
    </div>
  );
};

export default TimeCircle;