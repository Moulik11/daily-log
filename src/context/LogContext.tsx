import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export type Activity = {
    id: string;
    name: string;
    duration: number; // minutes
    colorTheme: string;
    hour: number;
};

// We don't stick to 24-hr array in state rigidly, but we reconstruct it for UI
export type HourLog = {
    hour: number; // 0-23
    activities: Activity[];
};

type LogContextType = {
    currentDate: Date;
    logs: HourLog[];
    isLoading: boolean;
    setDate: (date: Date) => void;
    nextDay: () => void;
    prevDay: () => void;
    addActivity: (hour: number, activity: Omit<Activity, 'id' | 'hour'>) => Promise<void>;
    updateActivity: (activityId: string, updates: Partial<Activity>) => Promise<void>;
    deleteActivity: (activityId: string) => Promise<void>;
    totalDuration: number;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: React.ReactNode }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to get start of day string for DB querying/grouping if needed, 
    // but we will filter by 'date' column in DB.
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    useEffect(() => {
        fetchActivities();
    }, [dateStr]);

    const fetchActivities = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('date', dateStr);

        if (error) {
            console.error('Error fetching activities:', error);
        } else {
            // Map DB fields to State fields
            const mapped = (data || []).map((dbItem: any) => ({
                id: dbItem.id,
                name: dbItem.name,
                duration: dbItem.duration,
                colorTheme: dbItem.color_theme,
                hour: dbItem.hour
            }));
            setActivities(mapped);
        }
        setIsLoading(false);
    };

    const addActivity = async (hour: number, activityData: Omit<Activity, 'id' | 'hour'>) => {
        // 1. Optimistic Update
        const tempId = crypto.randomUUID();
        const newActivity: Activity = {
            id: tempId,
            hour,
            ...activityData
        };

        setActivities(prev => [...prev, newActivity]);

        // 2. DB Insert
        const { data, error } = await supabase
            .from('activities')
            .insert({
                date: dateStr,
                hour,
                name: activityData.name,
                duration: activityData.duration,
                color_theme: activityData.colorTheme // Use snake_case for DB column usually
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding activity:', error);
            // Revert on error
            setActivities(prev => prev.filter(a => a.id !== tempId));
        } else if (data) {
            // Replace optimistic ID with real ID
            setActivities(prev => prev.map(a => a.id === tempId ? { ...a, id: data.id, colorTheme: data.color_theme || data.colorTheme } : a));
        }
    };

    const updateActivity = async (activityId: string, updates: Partial<Activity>) => {
        setActivities(prev => prev.map(a => a.id === activityId ? { ...a, ...updates } : a));

        const { error } = await supabase
            .from('activities')
            .update({
                name: updates.name,
                duration: updates.duration,
                color_theme: updates.colorTheme
            })
            .eq('id', activityId);

        if (error) {
            console.error('Error updating activity:', error);
            fetchActivities(); // Revert/Refresh
        }
    };

    const deleteActivity = async (activityId: string) => {
        setActivities(prev => prev.filter(a => a.id !== activityId));

        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', activityId);

        if (error) {
            console.error('Error deleting activity:', error);
            fetchActivities();
        }
    };

    const nextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    const prevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    // Construct Logs structure for UI
    const logs: HourLog[] = Array.from({ length: 24 }, (_, i) => {
        const hourActivities = activities.filter(a => a.hour === i);
        // Be careful with DB field mapping snake_case vs camelCase. 
        // Usually Supabase returns what is in DB. We should ensure we map correctly.
        // Pro-tip: let's map DB results to Activity type inside fetchActivities if needed.
        // For now assuming we handle `color_theme` -> `colorTheme` mapping in fetch/add.

        // Actually, in fetchActivities, we just setActivities(data). 
        // If DB has `color_theme`, data will have `color_theme`. 
        // Our Typescript type expects `colorTheme`. 
        // We should fix the mapping in fetch.
        return {
            hour: i,
            activities: hourActivities
        };
    });

    const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);

    return (
        <LogContext.Provider value={{
            currentDate,
            logs,
            isLoading,
            setDate: setCurrentDate,
            nextDay,
            prevDay,
            addActivity,
            updateActivity,
            deleteActivity,
            totalDuration
        }}>
            {children}
        </LogContext.Provider>
    );
}

export function useDailyLog() {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useDailyLog must be used within a LogProvider');
    }
    return context;
}
