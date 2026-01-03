import { useDailyLog } from '@/context/LogContext';
import { format, isToday, isYesterday } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function TopBar() {
    const { totalDuration, currentDate, nextDay, prevDay, isLoading } = useDailyLog();
    const [direction, setDirection] = useState(0);

    const remainingParams = 1440 - totalDuration;
    const hoursLogged = Math.floor(totalDuration / 60);
    const minutesLogged = totalDuration % 60;

    let dateLabel = format(currentDate, 'EEEE, MMMM do');
    if (isToday(currentDate)) dateLabel = 'Today';
    else if (isYesterday(currentDate)) dateLabel = 'Yesterday';

    const handlePrev = () => {
        setDirection(-1);
        prevDay();
    };

    const handleNext = () => {
        setDirection(1);
        nextDay();
    };

    return (
        <div className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePrev}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center min-w-[140px]">
                    <motion.div
                        key={currentDate.toISOString()}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-medium tracking-tight text-white/90 flex items-center gap-2"
                    >
                        {dateLabel}
                    </motion.div>
                    {!isToday(currentDate) && !isYesterday(currentDate) && (
                        <span className="text-xs text-neutral-500 font-mono">
                            {format(currentDate, 'MMM d, yyyy')}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleNext}
                    disabled={isToday(currentDate)}
                    className={cn(
                        "p-1 rounded-full transition-colors text-neutral-400",
                        isToday(currentDate) ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 hover:text-white"
                    )}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col items-end">
                {isLoading ? (
                    <div className="text-sm text-neutral-500 animate-pulse">Syncing...</div>
                ) : (
                    <>
                        <div className="text-sm font-medium text-emerald-400/90">
                            {hoursLogged}h {minutesLogged}m <span className="text-neutral-500 font-normal">logged</span>
                        </div>
                        <div className="text-xs text-neutral-500">
                            {Math.floor(remainingParams / 60)}h {remainingParams % 60}m remaining
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
