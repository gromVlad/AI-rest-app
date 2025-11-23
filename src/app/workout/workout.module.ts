import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from './workout.service';
import { ComboService } from './combo.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    WorkoutService,
    ComboService
  ]
})
export class WorkoutModule { }