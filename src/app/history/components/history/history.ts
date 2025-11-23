import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../history.service';
import { WorkoutSession } from '../../../models';

@Component({
  selector: 'app-history',
  standalone: false,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {
  workoutSessions: WorkoutSession[] = [];
  selectedStyle: 'all' | 'boxing' | 'muaythai' | 'mma' = 'all';

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadWorkoutHistory();
  }

  loadWorkoutHistory(): void {
    if (this.selectedStyle === 'all') {
      this.workoutSessions = this.historyService.getWorkoutSessions().reverse(); // Newest first
    } else {
      this.workoutSessions = this.historyService.getWorkoutSessionsByStyle(this.selectedStyle).reverse();
    }
  }

  onStyleChange(style: 'all' | 'boxing' | 'muaythai' | 'mma'): void {
    this.selectedStyle = style;
    this.loadWorkoutHistory();
  }

  deleteSession(sessionId: string): void {
    if (confirm('Вы уверены, что хотите удалить эту тренировку из истории?')) {
      this.historyService.deleteWorkoutSession(sessionId);
      this.loadWorkoutHistory();
    }
  }

  clearAllHistory(): void {
    if (confirm('Вы уверены, что хотите удалить всю историю тренировок?')) {
      this.historyService.clearAllHistory();
      this.workoutSessions = [];
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
