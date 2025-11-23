import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { WorkoutSetupComponent } from './workout-setup/workout-setup';
import { WorkoutDisplayComponent } from './workout-display/workout-display';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'workout-setup', component: WorkoutSetupComponent },
  { path: 'workout', component: WorkoutDisplayComponent },
  { path: '**', redirectTo: '' }
];
