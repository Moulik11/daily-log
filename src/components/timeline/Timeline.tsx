import { useDailyLog } from '@/context/LogContext';
import { HourRow } from './HourRow';
import { useEffect } from 'react';

export function Timeline() {
    const { logs } = useDailyLog();

    // Scroll to current hour on mount and when logs update (only initially effectively)
    useEffect(() => {
        // Only scroll if we have logs rendered and it's the first load
        const currentHour = new Date().getHours();
        const element = document.getElementById(`hour-${currentHour}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [logs]); // Re-run when logs change (initial load) - simplistic but works for now

    return (
        <div className="flex flex-col pb-32">
            {logs.map((log) => (
                <div key={log.hour} id={`hour-${log.hour}`}>
                    <HourRow log={log} />
                </div>
            ))}

            <div className="text-center text-neutral-600 text-xs py-8 opacity-50">
                End of day
            </div>
        </div>
    );
}
