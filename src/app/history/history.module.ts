import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from './history.service';
import { HistoryComponent } from './components/history/history';

@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HistoryComponent
  ],
  providers: [
    HistoryService
  ]
})
export class HistoryModule { }