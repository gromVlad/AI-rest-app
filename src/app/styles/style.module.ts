import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleService } from './style.service';
import { StyleSelectorComponent } from './components/style-selector/style-selector';

@NgModule({
  declarations: [
    StyleSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StyleSelectorComponent
  ],
  providers: [
    StyleService
  ]
})
export class StyleModule { }