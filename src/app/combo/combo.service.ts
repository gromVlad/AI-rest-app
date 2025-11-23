import { Injectable } from '@angular/core';
import { MoveService } from '../moves/move.service';
import { Move, Combo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  private combos: Combo[] = [
    // Example combos for different styles
    {
      id: 'combo-1',
      name: 'Basic combo',
      style: 'boxing',
      moves: ['boxing-jab', 'boxing-cross', 'boxing-left-hook']
    },
    {
      id: 'combo-2',
      name: 'Power combo',
      style: 'boxing',
      moves: ['boxing-jab', 'boxing-jab', 'boxing-cross', 'boxing-right-hook', 'boxing-left-uppercut']
    },
    {
      id: 'combo-3',
      name: 'Muay Thai combo',
      style: 'muaythai',
      moves: ['boxing-jab', 'muaythai-low-kick', 'boxing-cross', 'muaythai-knee']
    }
  ];

  constructor(private moveService: MoveService) {}

  getCombosForStyle(style: 'boxing' | 'muaythai' | 'mma'): Combo[] {
    return this.combos.filter(combo => combo.style === style);
  }

  getUserCombosForStyle(style: 'boxing' | 'muaythai' | 'mma'): Combo[] {
    // In a real app, this would fetch from localStorage or backend
    // For now, return an empty array as placeholder
    return JSON.parse(localStorage.getItem('userCombos') || '[]')
      .filter((combo: Combo) => combo.style === style);
  }

  getAllCombos(): Combo[] {
    return [...this.combos];
  }

  getComboById(id: string): Combo | undefined {
    return this.combos.find(combo => combo.id === id);
  }

  createCombo(combo: Omit<Combo, 'id'>): Combo {
    const newCombo: Combo = {
      ...combo,
      id: `combo-${Date.now()}`
    };
    this.combos.push(newCombo);

    // Save user combos to localStorage
    this.saveUserCombos();
    
    return newCombo;
  }

  updateCombo(updatedCombo: Combo): void {
    const index = this.combos.findIndex(combo => combo.id === updatedCombo.id);
    if (index !== -1) {
      this.combos[index] = updatedCombo;
      this.saveUserCombos();
    }
  }

  deleteCombo(id: string): void {
    const index = this.combos.findIndex(combo => combo.id === id);
    if (index !== -1) {
      this.combos.splice(index, 1);
      this.saveUserCombos();
    }
  }

  private saveUserCombos(): void {
    // In a real app, we'd separate system combos from user combos
    // For now, we'll save all combos to localStorage
    const userCombos = this.combos.filter(combo => 
      !['combo-1', 'combo-2', 'combo-3'].includes(combo.id) // These are system combos
    );
    localStorage.setItem('userCombos', JSON.stringify(userCombos));
  }

  getMovesForCombo(combo: Combo): Move[] {
    return combo.moves
      .map(moveId => this.moveService.getMoveById(moveId))
      .filter((move): move is Move => move !== undefined);
  }
}