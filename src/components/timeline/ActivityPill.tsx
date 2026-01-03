import { Activity } from '@/context/LogContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Map of color themes to Tailwind classes
const THEMES: Record<string, string> = {
    green: 'bg-green-800/40 text-green-200 border-green-600/30 shadow-[0_0_10px_-2px_rgba(34,197,94,0.2)]',
    blue: 'bg-blue-800/40 text-blue-200 border-blue-600/30 shadow-[0_0_10px_-2px_rgba(59,130,246,0.2)]',
    purple: 'bg-purple-800/40 text-purple-200 border-purple-600/30 shadow-[0_0_10px_-2px_rgba(168,85,247,0.2)]',
    orange: 'bg-orange-800/40 text-orange-200 border-orange-600/30 shadow-[0_0_10px_-2px_rgba(249,115,22,0.2)]',
    pink: 'bg-pink-800/40 text-pink-200 border-pink-600/30 shadow-[0_0_10px_-2px_rgba(236,72,153,0.2)]',
    indigo: 'bg-indigo-800/40 text-indigo-200 border-indigo-600/30 shadow-[0_0_10px_-2px_rgba(99,102,241,0.2)]',
    yellow: 'bg-yellow-800/40 text-yellow-200 border-yellow-600/30 shadow-[0_0_10px_-2px_rgba(234,179,8,0.2)]',
    red: 'bg-red-800/40 text-red-200 border-red-600/30 shadow-[0_0_10px_-2px_rgba(239,68,68,0.2)]',
    teal: 'bg-teal-800/40 text-teal-200 border-teal-600/30 shadow-[0_0_10px_-2px_rgba(20,184,166,0.2)]',
    cyan: 'bg-cyan-800/40 text-cyan-200 border-cyan-600/30 shadow-[0_0_10px_-2px_rgba(6,182,212,0.2)]',
};

interface ActivityPillProps {
    activity: Activity;
    onClick?: () => void;
}

export function ActivityPill({ activity, onClick }: ActivityPillProps) {
    const themeClasses = THEMES[activity.colorTheme] || THEMES.blue;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-colors",
                "flex items-center gap-2 select-none",
                themeClasses
            )}
        >
            <span className="truncate max-w-[120px]">{activity.name}</span>
            <span className="opacity-60 text-[10px] border-l border-white/10 pl-2">
                {activity.duration}m
            </span>
        </motion.button>
    );
}
