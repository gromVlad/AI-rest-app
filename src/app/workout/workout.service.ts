import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Move, WorkoutConfig, Combo, WorkoutSession } from '../models';
import { MoveService } from '../moves/move.service';
import { AudioService } from '../audio/audio.service';
import { ComboService } from '../combo/combo.service';
import { HistoryService } from '../history/history.service';

export interface WorkoutState {
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentRound: number;
  currentRoundTime: number; // in seconds
  totalRounds: number;
  restTime: number; // in seconds (when applicable)
  currentMove?: Move;
  nextMove?: Move;
  currentCombo?: Combo;
  comboIndex?: number; // position in combo if currently playing a combo
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService implements OnDestroy {
  private config: WorkoutConfig | null = null;
  private stateSubject = new BehaviorSubject<WorkoutState>({
    status: 'idle',
    currentRound: 0,
    currentRoundTime: 0,
    totalRounds: 0,
    restTime: 0
  });
  public state$ = this.stateSubject.asObservable();

  private timerSubscription: Subscription | null = null;
  private restTimerSubscription: Subscription | null = null;
  private roundInterval: number = 0;

  constructor(
    private moveService: MoveService,
    private audioService: AudioService,
    private comboService: ComboService,
    private historyService: HistoryService
  ) {}

  ngOnDestroy(): void {
    this.stopWorkout();
  }

  configureWorkout(config: WorkoutConfig): void {
    this.config = config;
    this.resetState(config);
  }

  private resetState(config: WorkoutConfig): void {
    const newState: WorkoutState = {
      status: 'idle',
      currentRound: 0,
      currentRoundTime: config.roundDuration,
      totalRounds: config.rounds,
      restTime: config.restDuration
    };
    this.stateSubject.next(newState);
  }

  startWorkout(): void {
    if (!this.config) {
      console.error('Workout not configured!');
      return;
    }

    const state = this.stateSubject.value;
    if (state.status === 'running') return; // Already running

    const newState: WorkoutState = {
      ...state,
      status: 'running',
      currentRound: state.currentRound > 0 ? state.currentRound : 1
    };
    this.stateSubject.next(newState);

    // Start the workout timer
    this.startRoundTimer();
  }

  private startRoundTimer(): void {
    if (!this.config) return;

    const state = this.stateSubject.value;
    if (state.currentRound > this.config.rounds) {
      // Workout is complete
      this.completeWorkout();
      return;
    }

    // Calculate interval based on speed
    let intervalMs: number;
    switch (this.config.speed) {
      case 'slow':
        intervalMs = 2000; // 1.5-2.5s range avg
        break;
      case 'medium':
        intervalMs = 1200; // 1-1.4s range avg
        break;
      case 'fast':
        intervalMs = 700; // 0.5-0.9s range avg
        break;
      default:
        intervalMs = 1200;
    }

    // Start the main timer for the round
    this.timerSubscription = interval(intervalMs).subscribe(() => {
      const currentState = this.stateSubject.value;
      if (currentState.status !== 'running') {
        this.stopTimer();
        return;
      }

      if (currentState.currentRoundTime <= 0) {
        // Round is complete, start rest period
        this.startRestPeriod();
      } else {
        // Generate and play the next move
        this.generateAndPlayMove();

        // Update the round time
        const newRoundTime = Math.max(0, currentState.currentRoundTime - (intervalMs / 1000));
        const newState = {
          ...currentState,
          currentRoundTime: newRoundTime
        };
        this.stateSubject.next(newState);

        // Check if it's last 5 seconds
        if (newRoundTime <= 5 && newRoundTime >= 4.5) {
          this.audioService.playSystemAudio('five-seconds');
        }
      }
    });
  }

  private generateAndPlayMove(): void {
    console.log('Начинаем генерацию и воспроизведение движения');
    if (!this.config) {
      console.log('Конфигурация тренировки отсутствует');
      return;
    }

    const moves = this.moveService.getMovesForStyle(this.config.style);
    console.log('Доступные движения для стиля', this.config.style, ':', moves.length);

    let move: Move | undefined;

    // Depending on the mode, generate either a random move or a combo sequence
    if (this.config.mode === 'random') {
      // Select a random move
      console.log('Режим: случайные удары');
      move = moves[Math.floor(Math.random() * moves.length)];
    } else if (this.config.mode === 'combos') {
      // Select a random combo and play the next move in it
      console.log('Режим: случайные комбинации');
      const combos = this.comboService.getCombosForStyle(this.config.style);
      if (combos.length > 0) {
        const randomCombo = combos[Math.floor(Math.random() * combos.length)];
        const randomMoveId = randomCombo.moves[Math.floor(Math.random() * randomCombo.moves.length)];
        move = this.moveService.getMoveById(randomMoveId);
      } else {
        // If no combos available, fallback to random moves
        console.log('Нет доступных комбинаций, используем случайные удары');
        move = moves[Math.floor(Math.random() * moves.length)];
      }
    } else if (this.config.mode === 'user-combos') {
      // Use only user-created combos
      console.log('Режим: пользовательские комбинации');
      const userCombos = this.comboService.getUserCombosForStyle(this.config.style);
      if (userCombos.length > 0) {
        const randomCombo = userCombos[Math.floor(Math.random() * userCombos.length)];
        const randomMoveId = randomCombo.moves[Math.floor(Math.random() * randomCombo.moves.length)];
        move = this.moveService.getMoveById(randomMoveId);
      } else {
        // If no user combos available, fallback to random moves
        console.log('Нет пользовательских комбинаций, используем случайные удары');
        move = moves[Math.floor(Math.random() * moves.length)];
      }
    }

    if (move) {
      console.log('Выбрано движение:', move.name, 'с id:', move.id);
      // Play the audio for the move
      this.audioService.playMoveAudio(move.name, move.id);

      // Update the state with the current move
      const currentState = this.stateSubject.value;
      const newState: WorkoutState = {
        ...currentState,
        currentMove: move
      };
      this.stateSubject.next(newState);
    } else {
      console.log('Не удалось выбрать движение');
    }
  }

  private startRestPeriod(): void {
    if (!this.config) return;

    const state = this.stateSubject.value;
    const restDuration = this.config.restDuration;

    // Update state to reflect rest period
    const newState: WorkoutState = {
      ...state,
      status: 'running', // Still running, just in rest mode
      restTime: restDuration
    };
    this.stateSubject.next(newState);

    // Play rest audio
    this.audioService.playSystemAudio('pause');

    // Start rest timer
    this.restTimerSubscription = interval(1000).subscribe(() => {
      const currentState = this.stateSubject.value;

      if (currentState.status !== 'running') {
        this.stopTimer();
        return;
      }

      const newRestTime = Math.max(0, currentState.restTime - 1);
      const updatedState: WorkoutState = {
        ...currentState,
        restTime: newRestTime
      };
      this.stateSubject.next(updatedState);

      if (newRestTime <= 0) {
        // Rest period is over, move to next round or finish
        this.restTimerSubscription?.unsubscribe();
        this.restTimerSubscription = null;

        if (this.config && currentState.currentRound >= this.config.rounds) {
          // Workout is complete
          this.completeWorkout();
        } else if (this.config) {
          // Move to the next round
          const nextRoundState: WorkoutState = {
            ...currentState,
            currentRound: currentState.currentRound + 1,
            currentRoundTime: this.config.roundDuration,
            restTime: 0
          };
          this.stateSubject.next(nextRoundState);

          // Play start audio for the next round
          this.audioService.playSystemAudio('start');

          // Start the next round
          this.startRoundTimer();
        }
      }
    });
  }

  private completeWorkout(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }

    if (this.restTimerSubscription) {
      this.restTimerSubscription.unsubscribe();
      this.restTimerSubscription = null;
    }

    const currentState = this.stateSubject.value;
    const newState: WorkoutState = {
      ...currentState,
      status: 'completed'
    };
    this.stateSubject.next(newState);

    // Play completion audio
    this.audioService.playSystemAudio('stop');

    // Save workout to history
    if (this.config) {
      const session: Omit<WorkoutSession, 'id'> = {
        date: new Date(),
        style: this.config.style,
        type: this.config.mode,
        rounds: this.config.rounds,
        duration: this.config.roundDuration * this.config.rounds +
                  this.config.restDuration * (this.config.rounds > 1 ? this.config.rounds - 1 : 0), // Total duration including rest
        usedCombos: [] // In a real app, we would track which combos were used
      };
      this.historyService.saveWorkoutSession(session);
    }
  }

  pauseWorkout(): void {
    const state = this.stateSubject.value;
    if (state.status === 'running') {
      this.stopTimer();
      const newState: WorkoutState = {
        ...state,
        status: 'paused'
      };
      this.stateSubject.next(newState);
    }
  }

  resumeWorkout(): void {
    const state = this.stateSubject.value;
    if (state.status === 'paused' && this.config) {
      const newState: WorkoutState = {
        ...state,
        status: 'running'
      };
      this.stateSubject.next(newState);

      // Continue with the current round or rest period
      if (state.restTime > 0 && state.restTime < this.config.restDuration) {
        this.startRestPeriod();
      } else {
        this.startRoundTimer();
      }
    }
  }

  stopWorkout(): void {
    this.stopTimer();

    if (!this.config) {
      this.resetState({} as WorkoutConfig);
      return;
    }

    const newState: WorkoutState = {
      status: 'idle',
      currentRound: 0,
      currentRoundTime: this.config.roundDuration,
      totalRounds: this.config.rounds,
      restTime: this.config.restDuration
    };
    this.stateSubject.next(newState);
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }

    if (this.restTimerSubscription) {
      this.restTimerSubscription.unsubscribe();
      this.restTimerSubscription = null;
    }
  }

  getCurrentState(): WorkoutState {
    return this.stateSubject.value;
  }
}