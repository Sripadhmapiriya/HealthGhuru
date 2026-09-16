/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WeeklyDataPoint } from '../types';
import { WEEKLY_OVERVIEW_DATA } from '../mockData';

interface DashboardState {
  user: User;
  today: {
    waterGlasses: number;
    caloriesConsumed: number;
    workoutMinutes: number;
    sleepHours: number;
    moodScore: number | null;
    streak: number;
  };
  weeklyData: WeeklyDataPoint[];
}

interface DashboardContextType extends DashboardState {
  updateUser: (data: Partial<User>) => void;
  updateToday: (data: Partial<DashboardState['today']>) => void;
}

const defaultUser: User = {
  name: 'Arjun Kumar',
  email: 'arjun.kumar@email.com',
  plan: 'free',
  avatar: null,
  dob: '1995-08-15',
  gender: 'Male',
  height: 175,
  weight: 72,
  city: 'Chennai',
  goals: ['sleep_better', 'eat_healthier'],
  calorieTarget: 2000,
};

const defaultToday = {
  waterGlasses: 6,
  caloriesConsumed: 1450,
  workoutMinutes: 45,
  sleepHours: 0,
  moodScore: null,
  streak: 7,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [today, setToday] = useState<DashboardState['today']>(defaultToday);
  const [weeklyData] = useState<WeeklyDataPoint[]>(WEEKLY_OVERVIEW_DATA);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hg_user_profile');
    if (savedUser) {
      try {
        setUser({ ...defaultUser, ...JSON.parse(savedUser) });
      } catch (e) {
        console.error('Error parsing user from localStorage');
      }
    }

    // Initialize today's date key
    const dateStr = new Date().toISOString().split('T')[0];
    const savedWater = localStorage.getItem(`hg_water_${dateStr}`);
    const savedMood = localStorage.getItem(`hg_mood_${dateStr}`);
    
    setToday(prev => ({
      ...prev,
      waterGlasses: savedWater ? parseInt(savedWater) : prev.waterGlasses,
      moodScore: savedMood ? parseInt(savedMood) : prev.moodScore,
    }));

    setIsLoaded(true);
  }, []);

  // Update User
  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      const newUser = { ...prev, ...data };
      localStorage.setItem('hg_user_profile', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Update Today
  const updateToday = (data: Partial<DashboardState['today']>) => {
    setToday(prev => {
      const newToday = { ...prev, ...data };
      const dateStr = new Date().toISOString().split('T')[0];
      
      if (data.waterGlasses !== undefined) {
        localStorage.setItem(`hg_water_${dateStr}`, data.waterGlasses.toString());
      }
      if (data.moodScore !== undefined && data.moodScore !== null) {
        localStorage.setItem(`hg_mood_${dateStr}`, data.moodScore.toString());
      }
      
      return newToday;
    });
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-dark flex items-center justify-center" />;
  }

  return (
    <DashboardContext.Provider value={{ user, today, weeklyData, updateUser, updateToday }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
