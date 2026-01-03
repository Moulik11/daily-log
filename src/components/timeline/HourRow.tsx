import { useState } from 'react';
import { useDailyLog, HourLog, Activity } from '@/context/LogContext';
import { ActivityPill } from './ActivityPill';
import { ActivityForm } from './ActivityForm';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HourRowProps {
    log: HourLog;
}

export function HourRow({ log }: HourRowProps) {
    const { addActivity, updateActivity, deleteActivity } = useDailyLog();
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const hourLabel = format(new Date().setHours(log.hour, 0, 0, 0), 'h a');
    const totalMinutes = log.activities.reduce((sum, act) => sum + act.duration, 0);
    const isOverLimit = totalMinutes > 60;
    const hasActivities = log.activities.length > 0;

    const handleSave = (data: Omit<Activity, 'id'>) => {
        addActivity(log.hour, data);
        // Don't close immediately, allow adding more? Or maybe close. 
        // User expectation: "User can add multiple activity entries". So keep open.
    };

    const handleUpdate = (id: string, data: Omit<Activity, 'id'>) => {
        updateActivity(log.hour, id, data);
        setEditingId(null);
    };

    return (
        <div className="relative group">
            {/* Absolute time track line if desired, or just border-b */}
            <div
                className={cn(
                    "flex min-h-[80px] border-b border-white/5 transition-colors duration-300",
                    isExpanded ? "bg-white/5" : "hover:bg-white/[0.02]",
                    isOverLimit && !isExpanded && "bg-red-500/5 hover:bg-red-500/10"
                )}
            >
                {/* Left Column: Time Label */}
                <div className="w-20 flex-shrink-0 flex flex-col items-center justify-start pt-6 border-r border-white/5 text-neutral-500 font-mono text-sm">
                    <span>{hourLabel}</span>
                    {hasActivities && !isExpanded && (
                        <span className={cn("text-[10px] mt-1", isOverLimit ? "text-red-400" : "text-neutral-600")}>
                            {totalMinutes}m
                        </span>
                    )}
                </div>

                {/* Right Column: Content */}
                <div className="flex-1 p-4">
                    <div
                        className="cursor-pointer min-h-[48px] flex flex-wrap items-center gap-2"
                        onClick={() => !editingId && setIsExpanded(!isExpanded)}
                    >
                        {/* Empty State Prompt */}
                        {!hasActivities && !isExpanded && (
                            <span className="text-neutral-700 text-sm italic group-hover:text-neutral-600 transition-colors">
                                Log activity...
                            </span>
                        )}

                        {/* Activity Pills Summary */}
                        {log.activities.map((activity) => (
                            <ActivityPill
                                key={activity.id}
                                activity={activity}
                                onClick={() => {
                                    setIsExpanded(true);
                                    setEditingId(activity.id);
                                }}
                            />
                        ))}

                        {/* Warning Icon if 60+ */}
                        {isOverLimit && (
                            <AlertCircle className="w-4 h-4 text-red-500/50" />
                        )}
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                {/* Divider */}
                                <div className="h-px bg-white/5 my-3" />

                                {/* Existing items are clickable pills above. 
                    This area is for adding NEW or Editing logic. 
                    Actually, if we click a pill, it opens form in 'edit' mode.
                    Below is the 'Add New' form.
                */}

                                {editingId ? (
                                    <ActivityForm
                                        initialData={log.activities.find(a => a.id === editingId)}
                                        onSave={(data) => handleUpdate(editingId, data)}
                                        onCancel={() => setEditingId(null)}
                                        onDelete={() => {
                                            deleteActivity(log.hour, editingId);
                                            setEditingId(null);
                                        }}
                                    />
                                ) : (
                                    <ActivityForm
                                        onSave={handleSave}
                                        onCancel={() => setIsExpanded(false)}
                                    />
                                )}

                                {!editingId && (
                                    <div className="flex justify-end mt-2">
                                        <div className={cn("text-xs mr-auto flex items-center gap-2", isOverLimit ? "text-red-400" : "text-neutral-500")}>
                                            <span>Total: {totalMinutes} / 60 min</span>
                                            {isOverLimit && <span className="font-bold">Over limit!</span>}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
