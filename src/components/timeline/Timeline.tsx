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

            <div className="flex flex-col items-center gap-4 py-8">
                <button
                    onClick={() => {
                        const headers = ['Date', 'Hour', 'Activity', 'Duration (min)', 'Color'];
                        const rows = logs.flatMap(log =>
                            log.activities.map(act => [
                                new Date().toLocaleDateString(),
                                `${log.hour}:00`,
                                act.name,
                                act.duration,
                                act.colorTheme
                            ].join(','))
                        );

                        const csvContent = "data:text/csv;charset=utf-8,"
                            + headers.join(',') + "\n"
                            + rows.join("\n");

                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `daily_log_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                    Export to CSV
                </button>
                <div className="text-neutral-600 text-xs opacity-50">
                    End of day
                </div>
            </div>
        </div>
    );
}
