import React from 'react';

interface OffsetBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  offset?: 2 | 4;
  borderRadius?: number;
  className?: string;
  disabled?: boolean;
}

const OffsetBorderButton: React.FC<OffsetBorderButtonProps> = ({
  children,
  onClick,
  offset = 4,
  borderRadius = 12,
  className = '',
  disabled = false
}) => {
  const outerBorderRadius = borderRadius + offset;
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{
        '--border-radius': `${borderRadius}px`,
        '--outer-border-radius': `${outerBorderRadius}px`,
        '--offset': `${offset}px`
      } as React.CSSProperties}
    >
      <style>{`
        .button-container::before {
          content: '';
          position: absolute;
          top: calc(-1 * var(--offset));
          left: calc(-1 * var(--offset));
          right: calc(-1 * var(--offset));
          bottom: calc(-1 * var(--offset));
          border: 2px solid #000;
          border-radius: var(--outer-border-radius);
          transition: all 0.2s ease;
          z-index: 1;
        }

        .button-container:hover::before {
          border-color: #666;
          transform: scale(1.02);
        }

        .button-container.disabled::before {
          border-color: #ccc;
        }

        .custom-button {
          position: relative;
          z-index: 2;
          background-color: #000;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: var(--border-radius);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          width: 100%;
        }

        .custom-button:hover:not(:disabled) {
          background-color: #333;
          transform: scale(1.05);
        }

        .custom-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .custom-button:focus {
          box-shadow: 0 0 0 2px #000, 0 0 0 4px rgba(0, 0, 0, 0.1);
        }

        .custom-button:disabled {
          background-color: #888;
          cursor: not-allowed;
        }
      `}</style>
      
      <div className={`button-container ${disabled ? 'disabled' : ''}`}>
        <button 
          className="custom-button"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      </div>
    </div>
  );
};

export default OffsetBorderButton;