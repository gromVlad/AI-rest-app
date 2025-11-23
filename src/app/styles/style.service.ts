import { Injectable } from '@angular/core';

export interface Style {
  id: 'boxing' | 'muaythai' | 'mma';
  name: string;
  displayName: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private readonly styles: Style[] = [
    {
      id: 'boxing',
      name: 'boxing',
      displayName: 'Бокс',
      description: 'Тренировка с базовыми ударными техниками'
    },
    {
      id: 'muaythai',
      name: 'muaythai',
      displayName: 'Муай Тай',
      description: 'Тренировка с ударами ногами и коленями'
    },
    {
      id: 'mma',
      name: 'mma',
      displayName: 'MMA',
      description: 'Тренировка с расширенным набором ударов'
    }
  ];

  getStyles(): Style[] {
    return this.styles;
  }

  getStyleById(id: 'boxing' | 'muaythai' | 'mma'): Style | undefined {
    return this.styles.find(style => style.id === id);
  }

  getDefaultStyle(): Style {
    return this.styles[0]; // Default to boxing
  }
}