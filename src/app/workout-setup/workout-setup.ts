import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutConfig } from '../models';
import { WorkoutService } from '../workout/workout.service';

@Component({
  selector: 'app-workout-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-setup.html',
  styleUrls: ['./workout-setup.css']
})
export class WorkoutSetupComponent implements OnInit {
  workoutConfig: WorkoutConfig = {
    style: 'boxing',
    rounds: 3,
    roundDuration: 120, // 2 minutes
    restDuration: 30,
    speed: 'medium',
    mode: 'random'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    // Get the selected style from query params
    const style = this.route.snapshot.queryParamMap.get('style') as 'boxing' | 'muaythai' | 'mma';
    if (style) {
      this.workoutConfig.style = style;
    }
  }

  startWorkout(): void {
    this.workoutService.configureWorkout(this.workoutConfig);
    this.router.navigate(['/workout']);
  }

  onRoundsChange(value: string): void {
    const rounds = parseInt(value, 10);
    if (!isNaN(rounds) && rounds >= 1 && rounds <= 12) {
      this.workoutConfig.rounds = rounds;
    }
  }

  onRoundDurationChange(value: string): void {
    const duration = parseInt(value, 10);
    if (!isNaN(duration) && duration >= 30 && duration <= 300) {
      this.workoutConfig.roundDuration = duration;
    }
  }

  onRestDurationChange(value: string): void {
    const duration = parseInt(value, 10);
    if (!isNaN(duration) && duration >= 15 && duration <= 90) {
      this.workoutConfig.restDuration = duration;
    }
  }

  onSpeedChange(value: string): void {
    if (['slow', 'medium', 'fast'].includes(value)) {
      this.workoutConfig.speed = value as 'slow' | 'medium' | 'fast';
    }
  }

  onModeChange(value: string): void {
    if (['random', 'combos', 'user-combos'].includes(value)) {
      this.workoutConfig.mode = value as 'random' | 'combos' | 'user-combos';
    }
  }
}
