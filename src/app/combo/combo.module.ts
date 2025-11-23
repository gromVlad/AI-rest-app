import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboService } from './combo.service';
import { ComboEditorComponent } from './components/combo-editor/combo-editor';

@NgModule({
  declarations: [
    ComboEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComboEditorComponent
  ],
  providers: [
    ComboService
  ]
})
export class ComboModule { }