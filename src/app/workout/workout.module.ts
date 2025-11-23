import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from './workout.service';
import { HistoryService } from '../history/history.service';
import { ComboService } from '../combo/combo.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    WorkoutService,
    ComboService,
    HistoryService
  ]
})
export class WorkoutModule { }