import React, { useState, useRef, useCallback } from 'react';
import { Play, Coffee } from 'lucide-react';

interface TimeRange {
  start: string;
  end: string;
}

interface WorkTimeData {
  workTime: TimeRange;
  breakTime: TimeRange;
}

interface WorkTimeSelectorProps {
  onTimeChange?: (data: WorkTimeData) => void;
  initialWorkTime?: TimeRange;
  initialBreakTime?: TimeRange;
  size?: 'sm' | 'md' | 'lg';
  showInputs?: boolean;
  showSummary?: boolean;
  className?: string;
}

const WorkTimeSelector: React.FC<WorkTimeSelectorProps> = ({
  onTimeChange,
  initialWorkTime = { start: '09:00', end: '17:00' },
  initialBreakTime = { start: '12:00', end: '13:00' },
  size = 'md',
  showInputs = true,
  showSummary = true,
  className = ''
}) => {
  const [workTime, setWorkTime] = useState<TimeRange>(initialWorkTime);
  const [breakTime, setBreakTime] = useState<TimeRange>(initialBreakTime);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    type: 'start' | 'end' | 'arc' | null;
    circle: 'work' | 'break' | null;
    initialAngle?: number;
    initialStart?: string;
    initialEnd?: string;
  }>({ isDragging: false, type: null, circle: null });

  const circleRef = useRef<SVGSVGElement>(null);

  const timeToAngle = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 360 - 90; // -90 to start from top
  };

  const angleToTime = (angle: number): string => {
    const normalizedAngle = ((angle + 90) % 360 + 360) % 360;
    const totalMinutes = (normalizedAngle / 360) * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round((totalMinutes % 60) / 15) * 15; // Round to nearest 15 minutes
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  const getPointOnCircle = (angle: number, radius: number, center: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };
  const getAngleFromPoint = (clientX: number, clientY: number, center: number) => {
    if (!circleRef.current) return 0;
    
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + center;
    const centerY = rect.top + center;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };
  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end' | 'arc', circle: 'work' | 'break') => {
    e.preventDefault();
    setDragState({ isDragging: true, type, circle });
  };

  const handleTouchStart = (e: React.TouchEvent, type: 'start' | 'end' | 'arc', circle: 'work' | 'break') => {
    e.preventDefault();
    setDragState({ isDragging: true, type, circle });
  };  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.type || !dragState.circle) return;

    // Get the config to access center
    const config = sizeConfig[size];
    const center = config.svg / 2;
    const angle = getAngleFromPoint(e.clientX, e.clientY, center);

    if (dragState.type === 'arc') {
      // Move entire arc - calculate offset from initial position
      if (dragState.initialAngle !== undefined && dragState.initialStart && dragState.initialEnd) {
        const angleDiff = angle - dragState.initialAngle;
        const startAngle = timeToAngle(dragState.initialStart) + angleDiff;
        const endAngle = timeToAngle(dragState.initialEnd) + angleDiff;
        
        const newStart = angleToTime(startAngle);
        const newEnd = angleToTime(endAngle);

        if (dragState.circle === 'work') {
          const newWorkTime = { start: newStart, end: newEnd };
          setWorkTime(newWorkTime);
          onTimeChange?.({ workTime: newWorkTime, breakTime });
        } else {
          const newBreakTime = { start: newStart, end: newEnd };
          setBreakTime(newBreakTime);
          onTimeChange?.({ workTime, breakTime: newBreakTime });
        }
      }
    } else {
      // Move individual handle
      const newTime = angleToTime(angle);

      if (dragState.circle === 'work') {
        const newWorkTime = { ...workTime, [dragState.type]: newTime };
        setWorkTime(newWorkTime);
        onTimeChange?.({ workTime: newWorkTime, breakTime });
      } else {
        const newBreakTime = { ...breakTime, [dragState.type]: newTime };
        setBreakTime(newBreakTime);
        onTimeChange?.({ workTime, breakTime: newBreakTime });
      }
    }
  }, [dragState, workTime, breakTime, onTimeChange, size]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragState.isDragging || !dragState.type || !dragState.circle) return;

    // Get the config to access center
    const config = sizeConfig[size];
    const center = config.svg / 2;
    const touch = e.touches[0];
    const angle = getAngleFromPoint(touch.clientX, touch.clientY, center);

    if (dragState.type === 'arc') {
      // Move entire arc - calculate offset from initial position
      if (dragState.initialAngle !== undefined && dragState.initialStart && dragState.initialEnd) {
        const angleDiff = angle - dragState.initialAngle;
        const startAngle = timeToAngle(dragState.initialStart) + angleDiff;
        const endAngle = timeToAngle(dragState.initialEnd) + angleDiff;
        
        const newStart = angleToTime(startAngle);
        const newEnd = angleToTime(endAngle);

        if (dragState.circle === 'work') {
          const newWorkTime = { start: newStart, end: newEnd };
          setWorkTime(newWorkTime);
          onTimeChange?.({ workTime: newWorkTime, breakTime });
        } else {
          const newBreakTime = { start: newStart, end: newEnd };
          setBreakTime(newBreakTime);
          onTimeChange?.({ workTime, breakTime: newBreakTime });
        }
      }
    } else {
      // Move individual handle
      const newTime = angleToTime(angle);

      if (dragState.circle === 'work') {
        const newWorkTime = { ...workTime, [dragState.type]: newTime };
        setWorkTime(newWorkTime);
        onTimeChange?.({ workTime: newWorkTime, breakTime });
      } else {
        const newBreakTime = { ...breakTime, [dragState.type]: newTime };
        setBreakTime(newBreakTime);
        onTimeChange?.({ workTime, breakTime: newBreakTime });
      }
    }
  }, [dragState, workTime, breakTime, onTimeChange, size]);
  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, type: null, circle: null });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setDragState({ isDragging: false, type: null, circle: null });
  }, []);
  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleTimeInputChange = (
    circle: 'work' | 'break',
    type: 'start' | 'end',
    value: string
  ) => {
    if (circle === 'work') {
      const newWorkTime = { ...workTime, [type]: value };
      setWorkTime(newWorkTime);
      onTimeChange?.({ workTime: newWorkTime, breakTime });
    } else {
      const newBreakTime = { ...breakTime, [type]: value };
      setBreakTime(newBreakTime);
      onTimeChange?.({ workTime, breakTime: newBreakTime });
    }
  };
  const createArc = (startAngle: number, endAngle: number, radius: number, center: number) => {
    const start = getPointOnCircle(startAngle, radius, center);
    const end = getPointOnCircle(endAngle, radius, center);
    
    let sweepAngle = endAngle - startAngle;
    if (sweepAngle < 0) sweepAngle += 360;
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };
  const workStartAngle = timeToAngle(workTime.start);
  const workEndAngle = timeToAngle(workTime.end);
  const breakStartAngle = timeToAngle(breakTime.start);
  const breakEndAngle = timeToAngle(breakTime.end);
  // Size configurations
  const sizeConfig = {
    sm: { svg: 120, radius: 45, fontSize: 'text-xs', markers: 6, handleSize: 6 },
    md: { svg: 180, radius: 70, fontSize: 'text-sm', markers: 12, handleSize: 7 },
    lg: { svg: 240, radius: 95, fontSize: 'text-base', markers: 12, handleSize: 8 }
  };

  const config = sizeConfig[size];
  const center = config.svg / 2;

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Time Circle */}
      <div className="relative">        <svg
          ref={circleRef}
          width={config.svg}
          height={config.svg}
          className="cursor-pointer touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          
          {/* Hour markers */}
          {Array.from({ length: config.markers }, (_, i) => {
            const angle = (i * (360 / config.markers)) - 90;
            const innerRadius = config.radius - 8;
            const outerRadius = config.radius;
            const inner = {
              x: center + innerRadius * Math.cos((angle * Math.PI) / 180),
              y: center + innerRadius * Math.sin((angle * Math.PI) / 180)
            };
            const outer = {
              x: center + outerRadius * Math.cos((angle * Math.PI) / 180),
              y: center + outerRadius * Math.sin((angle * Math.PI) / 180)
            };
            
            const labelRadius = config.radius - 18;
            const label = {
              x: center + labelRadius * Math.cos((angle * Math.PI) / 180),
              y: center + labelRadius * Math.sin((angle * Math.PI) / 180)
            };
            
            return (
              <g key={i}>
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
                {size !== 'sm' && (
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`${config.fontSize} font-medium fill-gray-500`}
                  >
                    {config.markers === 12 ? (i === 0 ? 12 : i) : i * 4}
                  </text>
                )}
              </g>
            );
          })}
            {/* Work time arc */}
          <path
            d={createArc(workStartAngle, workEndAngle, config.radius, center)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
            className="cursor-move"
            onMouseDown={(e) => {
              const angle = getAngleFromPoint(e.clientX, e.clientY, center);
              setDragState({ 
                isDragging: true, 
                type: 'arc', 
                circle: 'work',
                initialAngle: angle,
                initialStart: workTime.start,
                initialEnd: workTime.end
              });
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const angle = getAngleFromPoint(touch.clientX, touch.clientY, center);
              setDragState({ 
                isDragging: true, 
                type: 'arc', 
                circle: 'work',
                initialAngle: angle,
                initialStart: workTime.start,
                initialEnd: workTime.end
              });
            }}
          />
            {/* Break time arc */}
          <path
            d={createArc(breakStartAngle, breakEndAngle, config.radius, center)}
            fill="none"
            stroke="#f97316"
            strokeWidth="6"
            strokeLinecap="round"
            className="cursor-move"
            onMouseDown={(e) => {
              const angle = getAngleFromPoint(e.clientX, e.clientY, center);
              setDragState({ 
                isDragging: true, 
                type: 'arc', 
                circle: 'break',
                initialAngle: angle,
                initialStart: breakTime.start,
                initialEnd: breakTime.end
              });
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const angle = getAngleFromPoint(touch.clientX, touch.clientY, center);
              setDragState({ 
                isDragging: true, 
                type: 'arc', 
                circle: 'break',
                initialAngle: angle,
                initialStart: breakTime.start,
                initialEnd: breakTime.end
              });
            }}
          />          {/* Work time handles */}
          <circle
            cx={center + config.radius * Math.cos((workStartAngle * Math.PI) / 180)}
            cy={center + config.radius * Math.sin((workStartAngle * Math.PI) / 180)}
            r={config.handleSize}
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'start', 'work')}
            onTouchStart={(e) => handleTouchStart(e, 'start', 'work')}
          />
          <circle
            cx={center + config.radius * Math.cos((workEndAngle * Math.PI) / 180)}
            cy={center + config.radius * Math.sin((workEndAngle * Math.PI) / 180)}
            r={config.handleSize}
            fill="#1d4ed8"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'end', 'work')}
            onTouchStart={(e) => handleTouchStart(e, 'end', 'work')}
          />          {/* Break time handles */}
          <circle
            cx={center + config.radius * Math.cos((breakStartAngle * Math.PI) / 180)}
            cy={center + config.radius * Math.sin((breakStartAngle * Math.PI) / 180)}
            r={config.handleSize + 1}
            fill="#f97316"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'start', 'break')}
            onTouchStart={(e) => handleTouchStart(e, 'start', 'break')}
          />
          <circle
            cx={center + config.radius * Math.cos((breakEndAngle * Math.PI) / 180)}
            cy={center + config.radius * Math.sin((breakEndAngle * Math.PI) / 180)}
            r={config.handleSize + 1}
            fill="#ea580c"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'end', 'break')}
            onTouchStart={(e) => handleTouchStart(e, 'end', 'break')}
          />
        </svg>
        
        {/* Legend */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-70"></div>
            <span className="text-gray-600">Work</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Break</span>
          </div>
        </div>
      </div>

      {/* Time Inputs */}
      {showInputs && (
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-xs">
          {/* Work Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-1 text-blue-600">
              <Play size={12} />
              <span className="font-medium">Work</span>
            </div>
            <div className="space-y-1">
              <input
                type="time"
                value={workTime.start}
                onChange={(e) => handleTimeInputChange('work', 'start', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start"
              />
              <input
                type="time"
                value={workTime.end}
                onChange={(e) => handleTimeInputChange('work', 'end', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End"
              />
            </div>
          </div>

          {/* Break Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-1 text-orange-600">
              <Coffee size={12} />
              <span className="font-medium">Break</span>
            </div>
            <div className="space-y-1">
              <input
                type="time"
                value={breakTime.start}
                onChange={(e) => handleTimeInputChange('break', 'start', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Start"
              />
              <input
                type="time"
                value={breakTime.end}
                onChange={(e) => handleTimeInputChange('break', 'end', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="End"
              />
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="bg-white border border-gray-200 p-3 rounded-lg w-full max-w-xs text-xs">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">Work:</span>
              <span className="text-gray-700 font-mono">{workTime.start} - {workTime.end}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-medium">Break:</span>
              <span className="text-gray-700 font-mono">{breakTime.start} - {breakTime.end}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600 font-medium">Total Work:</span>
              <span className="text-gray-900 font-semibold">
                {(() => {
                  const workStart = new Date(`1970-01-01T${workTime.start}`);
                  const workEnd = new Date(`1970-01-01T${workTime.end}`);
                  const breakStart = new Date(`1970-01-01T${breakTime.start}`);
                  const breakEnd = new Date(`1970-01-01T${breakTime.end}`);
                  
                  const totalWork = (workEnd.getTime() - workStart.getTime()) / (1000 * 60 * 60);
                  const breakDuration = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60);
                  
                  return `${(totalWork - breakDuration).toFixed(1)}h`;
                })()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTimeSelector;