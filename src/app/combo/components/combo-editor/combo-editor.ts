import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoveService } from '../../../moves/move.service';
import { ComboService } from '../../combo.service';
import { Move, Combo } from '../../../models';

@Component({
  selector: 'app-combo-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combo-editor.html',
  styleUrls: ['./combo-editor.css']
})
export class ComboEditorComponent implements OnInit {
  availableMoves: Move[] = [];
  selectedStyle: 'boxing' | 'muaythai' | 'mma' = 'boxing';
  comboName = '';
  selectedMoves: Move[] = [];
  savedCombos: Combo[] = [];

  constructor(
    private moveService: MoveService,
    private comboService: ComboService
  ) {}

  ngOnInit(): void {
    this.loadMovesForStyle(this.selectedStyle);
    this.loadSavedCombos();
  }

  loadMovesForStyle(style: 'boxing' | 'muaythai' | 'mma'): void {
    this.availableMoves = this.moveService.getMovesForStyle(style);
  }

  onStyleChange(style: 'boxing' | 'muaythai' | 'mma'): void {
    this.selectedStyle = style;
    this.loadMovesForStyle(style);
    this.loadSavedCombos();
  }

  addMoveToCombo(move: Move): void {
    if (this.selectedMoves.length < 8) { // Max 8 moves per combo as per specs
      this.selectedMoves = [...this.selectedMoves, move];
    }
  }

  removeMoveFromCombo(index: number): void {
    this.selectedMoves = this.selectedMoves.filter((_, i) => i !== index);
  }

  saveCombo(): void {
    if (this.comboName.trim() === '') {
      alert('Пожалуйста, введите название комбинации');
      return;
    }

    if (this.selectedMoves.length === 0) {
      alert('Пожалуйста, добавьте хотя бы один удар в комбинацию');
      return;
    }

    const combo: Omit<Combo, 'id'> = {
      name: this.comboName,
      style: this.selectedStyle,
      moves: this.selectedMoves.map(move => move.id)
    };

    this.comboService.createCombo(combo);
    this.comboName = '';
    this.selectedMoves = [];
    this.loadSavedCombos();
  }

  loadSavedCombos(): void {
    this.savedCombos = this.comboService.getUserCombosForStyle(this.selectedStyle);
  }

  useCombo(combo: Combo): void {
    // This would typically emit an event to be used in workout
    console.log('Using combo:', combo);
    // In a real app, this might emit an event to start a workout with this combo
  }

  deleteCombo(comboId: string): void {
    if (confirm('Вы уверены, что хотите удалить эту комбинацию?')) {
      this.comboService.deleteCombo(comboId);
      this.loadSavedCombos();
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  trackByMoveId(index: number, move: Move): string {
    return move.id;
  }

  getMoveName(moveId: string): string {
    const move = this.moveService.getMoveById(moveId);
    return move ? move.name : 'Unknown Move';
  }
}
