import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleService, Style } from '../../style.service';

@Component({
  selector: 'app-style-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './style-selector.html',
  styleUrls: ['./style-selector.css']
})
export class StyleSelectorComponent implements OnInit {
  @Output() styleSelected = new EventEmitter<'boxing' | 'muaythai' | 'mma'>();

  styles: Style[] = [];

  constructor(private styleService: StyleService) {}

  ngOnInit(): void {
    this.styles = this.styleService.getStyles();
  }

  selectStyle(styleId: 'boxing' | 'muaythai' | 'mma'): void {
    this.styleSelected.emit(styleId);
  }
}
