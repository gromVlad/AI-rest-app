import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StyleModule } from './styles/style.module';
import { MovesModule } from './moves/moves.module';
import { AudioModule } from './audio/audio.module';
import { WorkoutModule } from './workout/workout.module';
import { ComboModule } from './combo/combo.module';
import { HistoryModule } from './history/history.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    StyleModule,
    MovesModule,
    AudioModule,
    WorkoutModule,
    ComboModule,
    HistoryModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  protected readonly title = signal('shadow-fight-app');
}
