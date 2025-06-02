import React, { useState, useRef, useCallback } from 'react';
import { Clock, Play, Coffee } from 'lucide-react';

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
}

const WorkTimeSelector: React.FC<WorkTimeSelectorProps> = ({
  onTimeChange,
  initialWorkTime = { start: '09:00', end: '17:00' },
  initialBreakTime = { start: '12:00', end: '13:00' }
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

  const getPointOnCircle = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 90 + radius * Math.cos(rad),
      y: 90 + radius * Math.sin(rad)
    };
  };

  const getAngleFromPoint = (clientX: number, clientY: number) => {
    if (!circleRef.current) return 0;
    
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + 90;
    const centerY = rect.top + 90;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end' | 'arc', circle: 'work' | 'break') => {
    e.preventDefault();
    setDragState({ isDragging: true, type, circle });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.type || !dragState.circle) return;

    const angle = getAngleFromPoint(e.clientX, e.clientY);

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
  }, [dragState, workTime, breakTime, onTimeChange]);

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, type: null, circle: null });
  }, []);

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

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

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = getPointOnCircle(startAngle, radius);
    const end = getPointOnCircle(endAngle, radius);
    
    let sweepAngle = endAngle - startAngle;
    if (sweepAngle < 0) sweepAngle += 360;
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const workStartAngle = timeToAngle(workTime.start);
  const workEndAngle = timeToAngle(workTime.end);
  const breakStartAngle = timeToAngle(breakTime.start);
  const breakEndAngle = timeToAngle(breakTime.end);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg max-w-xs mx-auto">

      {/* Combined Circle */}
      <div className="relative">
        <svg
          ref={circleRef}
          width="180"
          height="180"
          className="cursor-pointer"
        >
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="3"
          />
          
          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) - 90; // Every 2 hours
            const innerRadius = 62;
            const outerRadius = 70;
            const inner = getPointOnCircle(angle, innerRadius);
            const outer = getPointOnCircle(angle, outerRadius);
            
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
                <text
                  x={getPointOnCircle(angle, 52).x}
                  y={getPointOnCircle(angle, 52).y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-medium fill-gray-500"
                >
                  {i * 2}
                </text>
              </g>
            );
          })}
          
          {/* Work time arc (bottom layer) */}
          <path
            d={createArc(workStartAngle, workEndAngle, 70)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
            className="cursor-move"
            onMouseDown={(e) => {
              const angle = getAngleFromPoint(e.clientX, e.clientY);
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
          
          {/* Break time arc (on top) */}
          <path
            d={createArc(breakStartAngle, breakEndAngle, 70)}
            fill="none"
            stroke="#f97316"
            strokeWidth="6"
            strokeLinecap="round"
            className="cursor-move"
            onMouseDown={(e) => {
              const angle = getAngleFromPoint(e.clientX, e.clientY);
              setDragState({ 
                isDragging: true, 
                type: 'arc', 
                circle: 'break',
                initialAngle: angle,
                initialStart: breakTime.start,
                initialEnd: breakTime.end
              });
            }}
          />
          
          {/* Work time handles */}
          <circle
            cx={getPointOnCircle(workStartAngle, 70).x}
            cy={getPointOnCircle(workStartAngle, 70).y}
            r="5"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'start', 'work')}
          />
          <circle
            cx={getPointOnCircle(workEndAngle, 70).x}
            cy={getPointOnCircle(workEndAngle, 70).y}
            r="5"
            fill="#1d4ed8"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'end', 'work')}
          />
          
          {/* Break time handles (on top) */}
          <circle
            cx={getPointOnCircle(breakStartAngle, 70).x}
            cy={getPointOnCircle(breakStartAngle, 70).y}
            r="6"
            fill="#f97316"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'start', 'break')}
          />
          <circle
            cx={getPointOnCircle(breakEndAngle, 70).x}
            cy={getPointOnCircle(breakEndAngle, 70).y}
            r="6"
            fill="#ea580c"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, 'end', 'break')}
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
      <div className="grid grid-cols-2 gap-3 w-full text-xs">
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
              className="w-full border rounded px-2 py-1 text-xs text-center bg-white"
              placeholder="Start"
            />
            <input
              type="time"
              value={workTime.end}
              onChange={(e) => handleTimeInputChange('work', 'end', e.target.value)}
              className="w-full border rounded px-2 py-1 text-xs text-center bg-white"
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
              className="w-full border rounded px-2 py-1 text-xs text-center bg-white"
              placeholder="Start"
            />
            <input
              type="time"
              value={breakTime.end}
              onChange={(e) => handleTimeInputChange('break', 'end', e.target.value)}
              className="w-full border rounded px-2 py-1 text-xs text-center bg-white"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-2 rounded border w-full text-xs">
        <div className="text-center space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-600 font-medium">Work:</span>
            <span className="text-gray-700">{workTime.start} - {workTime.end}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-600 font-medium">Break:</span>
            <span className="text-gray-700">{breakTime.start} - {breakTime.end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeSelector;