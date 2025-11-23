import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { WorkoutSetupComponent } from './workout-setup/workout-setup';
import { WorkoutDisplayComponent } from './workout-display/workout-display';
import { ComboEditorComponent } from './combo/components/combo-editor/combo-editor';
import { HistoryComponent } from './history/components/history/history';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'workout-setup', component: WorkoutSetupComponent },
  { path: 'workout', component: WorkoutDisplayComponent },
  { path: 'combo-editor', component: ComboEditorComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' }
];
