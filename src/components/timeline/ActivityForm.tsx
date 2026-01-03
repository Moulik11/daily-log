import { useState, useEffect } from 'react';
import { Activity } from '@/context/LogContext';
import { motion } from 'framer-motion';
import { Check, Trash2, X } from 'lucide-react';

const COLORS = ['green', 'blue', 'purple', 'orange', 'pink', 'indigo', 'yellow', 'red', 'teal', 'cyan'];

interface ActivityFormProps {
    initialData?: Activity;
    onSave: (data: Omit<Activity, 'id' | 'hour'>) => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export function ActivityForm({ initialData, onSave, onCancel, onDelete }: ActivityFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [duration, setDuration] = useState(initialData?.duration?.toString() || '');
    // Random color logic if no initial data
    const [theme, setTheme] = useState(initialData?.colorTheme || '');

    useEffect(() => {
        if (!initialData?.colorTheme && !theme) {
            setTheme(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !duration) return;

        onSave({
            name,
            duration: parseInt(duration, 10),
            colorTheme: theme,
        });
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2 mb-2 backdrop-blur-md"
            onSubmit={handleSubmit}
        >
            <div className="flex gap-2 mb-3">
                <input
                    autoFocus
                    type="text"
                    placeholder="Activity name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                    type="number"
                    placeholder="Min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-1.5 flex-wrap max-w-[60%]">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setTheme(c)}
                            className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${theme === c ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-900 scale-110' : 'opacity-60 hover:opacity-100'
                                }`}
                            style={{ backgroundColor: `var(--color-${c}-500, ${getColorHex(c)})` }}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 hover:bg-white/10 text-neutral-400 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <button
                        type="submit"
                        disabled={!name || !duration}
                        className="p-2 bg-white/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.form>
    );
}

function getColorHex(colorName: string) {
    const map: Record<string, string> = {
        green: '#22c55e', blue: '#3b82f6', purple: '#a855f7', orange: '#f97316',
        pink: '#ec4899', indigo: '#6366f1', yellow: '#eab308', red: '#ef4444',
        teal: '#14b8a6', cyan: '#06b6d4'
    };
    return map[colorName] || '#fff';
}
