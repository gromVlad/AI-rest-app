import { Injectable } from '@angular/core';
import { WorkoutSession } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly STORAGE_KEY = 'workoutHistory';

  saveWorkoutSession(session: Omit<WorkoutSession, 'id'>): WorkoutSession {
    const sessions = this.getWorkoutSessions();
    const newSession: WorkoutSession = {
      ...session,
      id: this.generateId()
    };
    
    sessions.push(newSession);
    this.saveToStorage(sessions);
    
    return newSession;
  }

  getWorkoutSessions(): WorkoutSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getWorkoutSessionsByStyle(style: 'boxing' | 'muaythai' | 'mma'): WorkoutSession[] {
    return this.getWorkoutSessions().filter(session => session.style === style);
  }

  deleteWorkoutSession(sessionId: string): void {
    const sessions = this.getWorkoutSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    this.saveToStorage(filteredSessions);
  }

  clearAllHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveToStorage(sessions: WorkoutSession[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  private generateId(): string {
    return `session-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}