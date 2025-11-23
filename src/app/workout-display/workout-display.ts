import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WorkoutService, WorkoutState } from '../workout/workout.service';

@Component({
  selector: 'app-workout-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-display.html',
  styleUrls: ['./workout-display.css']
})
export class WorkoutDisplayComponent implements OnInit, OnDestroy {
  state: WorkoutState | null = null;
  private stateSubscription: Subscription | null = null;

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stateSubscription = this.workoutService.state$.subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  startWorkout(): void {
    this.workoutService.startWorkout();
  }

  pauseWorkout(): void {
    this.workoutService.pauseWorkout();
  }

  resumeWorkout(): void {
    this.workoutService.resumeWorkout();
  }

  stopWorkout(): void {
    this.workoutService.stopWorkout();
    this.router.navigate(['/']);
  }

  getRoundTimeFormatted(): string {
    if (!this.state) return '00:00';
    const minutes = Math.floor(this.state.currentRoundTime / 60);
    const seconds = Math.floor(this.state.currentRoundTime % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getRestTimeFormatted(): string {
    if (!this.state) return '00:00';
    const minutes = Math.floor(this.state.restTime / 60);
    const seconds = Math.floor(this.state.restTime % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  showRestTime(): boolean {
    return this.state?.restTime != null && this.state.restTime > 0;
  }
}
