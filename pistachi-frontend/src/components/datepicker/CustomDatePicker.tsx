import { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight, CalendarBlank } from '@phosphor-icons/react';
import './CustomDatePicker.css';

interface CustomDatePickerProps {
    value: string; // 'YYYY-MM-DD'
    onChange: (date: string) => void;
    mode: 'birthdate' | 'future';
    label?: string;
    required?: boolean;
}

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const CustomDatePicker = ({ value, onChange, mode, label, required }: CustomDatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Internal state for the calendar view
    const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
    
    // State for selectors
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [showMonthSelector, setShowMonthSelector] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize view from value
    useEffect(() => {
        if (value) {
            const [y, m] = value.split('-');
            if (y && m) {
                setViewYear(parseInt(y));
                setViewMonth(parseInt(m));
            }
        } else if (mode === 'birthdate') {
            setViewYear(new Date().getFullYear() - 25); // Default to 25 years ago for birthdate
        }
    }, [value, mode]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowYearSelector(false);
                setShowMonthSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper functions
    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const getDaysInMonth = (year: number, month: number) => {
        if (month === 2) return isLeapYear(year) ? 29 : 28;
        if ([4, 6, 9, 11].includes(month)) return 30;
        return 31;
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        let day = new Date(year, month - 1, 1).getDay();
        // Convert Sunday=0 to Monday=0, Sunday=6
        return day === 0 ? 6 : day - 1;
    };

    // Range calculations
    const currentYear = new Date().getFullYear();
    let minYear = currentYear;
    let maxYear = currentYear;

    if (mode === 'birthdate') {
        minYear = currentYear - 110;
        maxYear = currentYear - 1;
    } else if (mode === 'future') {
        minYear = currentYear;
        maxYear = currentYear + 10;
    }

    const yearsList = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

    // Handlers
    const handleDayClick = (day: number) => {
        const yStr = viewYear.toString();
        const mStr = viewMonth.toString().padStart(2, '0');
        const dStr = day.toString().padStart(2, '0');
        onChange(`${yStr}-${mStr}-${dStr}`);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        if (viewMonth === 1) {
            if (viewYear > minYear) {
                setViewMonth(12);
                setViewYear(prev => prev - 1);
            }
        } else {
            setViewMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 12) {
            if (viewYear < maxYear) {
                setViewMonth(1);
                setViewYear(prev => prev + 1);
            }
        } else {
            setViewMonth(prev => prev + 1);
        }
    };

    // Render Calendar Grid
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    
    const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} className="calendar-day empty"></div>);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const isSelected = value === `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return (
            <button 
                key={`day-${day}`} 
                type="button"
                className={`calendar-day ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day)}
            >
                {day}
            </button>
        );
    });

    // Formatting for the display input
    const displayValue = value ? value.split('-').reverse().join('/') : '';

    return (
        <div className="custom-datepicker-container" ref={containerRef}>
            {/* The Input Trigger (Looks exactly like the floating-input) */}
            <div className="floating-input-group" style={{ marginTop: '10px' }}>
                <CalendarBlank size={22} weight="bold" className="input-icon left-icon" />
                <input 
                    type="text" 
                    readOnly
                    className={`floating-input ${displayValue.length > 0 ? 'filled' : ''} datepicker-trigger`}
                    value={displayValue}
                    onClick={() => setIsOpen(!isOpen)}
                    placeholder=" "
                    required={required}
                />
                <label className="floating-label">{label || "Fecha"}</label>
            </div>

            {/* The Modal / Popover */}
            {isOpen && (
                <div className="datepicker-popover">
                    <div className="datepicker-header">
                        <button type="button" className="nav-btn" onClick={handlePrevMonth} disabled={viewYear === minYear && viewMonth === 1}>
                            <CaretLeft size={20} weight="bold" />
                        </button>

                        <div className="selectors">
                            {/* Month Selector */}
                            <div className="selector-wrapper">
                                <button type="button" className="selector-btn" onClick={() => {setShowMonthSelector(!showMonthSelector); setShowYearSelector(false);}}>
                                    {MESES[viewMonth - 1]}
                                </button>
                                {showMonthSelector && (
                                    <div className="selector-dropdown">
                                        {MESES.map((mes, idx) => (
                                            <button 
                                                key={mes} 
                                                type="button" 
                                                className={`dropdown-item ${viewMonth === idx + 1 ? 'active' : ''}`}
                                                onClick={() => { setViewMonth(idx + 1); setShowMonthSelector(false); }}
                                            >
                                                {mes}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Year Selector */}
                            <div className="selector-wrapper">
                                <button type="button" className="selector-btn" onClick={() => {setShowYearSelector(!showYearSelector); setShowMonthSelector(false);}}>
                                    {viewYear}
                                </button>
                                {showYearSelector && (
                                    <div className="selector-dropdown year-dropdown">
                                        {yearsList.map((y) => (
                                            <button 
                                                key={y} 
                                                type="button" 
                                                className={`dropdown-item ${viewYear === y ? 'active' : ''}`}
                                                onClick={() => { setViewYear(y); setShowYearSelector(false); }}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="button" className="nav-btn" onClick={handleNextMonth} disabled={viewYear === maxYear && viewMonth === 12}>
                            <CaretRight size={20} weight="bold" />
                        </button>
                    </div>

                    <div className="calendar-grid">
                        <div className="weekdays-row">
                            {DIAS_SEMANA.map(d => <div key={d} className="weekday">{d}</div>)}
                        </div>
                        <div className="days-grid">
                            {blanks}
                            {days}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
