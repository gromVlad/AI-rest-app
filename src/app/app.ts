import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StyleModule } from './styles/style.module';
import { MovesModule } from './moves/moves.module';
import { AudioModule } from './audio/audio.module';
import { WorkoutModule } from './workout/workout.module';

@Component({
  selector: 'app-root',
  standalone: false,
  imports: [
    RouterOutlet,
    StyleModule,
    MovesModule,
    AudioModule,
    WorkoutModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  protected readonly title = signal('shadow-fight-app');
}
