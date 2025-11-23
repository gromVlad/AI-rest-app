import { Injectable } from '@angular/core';
import { Move } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MoveService {
  private readonly moves: Move[] = [
    // Boxing moves
    {
      id: 'boxing-jab',
      name: 'Джеб',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/jab.mp3',
      duration: 500
    },
    {
      id: 'boxing-cross',
      name: 'Кросс',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/cross.mp3',
      duration: 500
    },
    {
      id: 'boxing-left-hook',
      name: 'Левый хук',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/left-hook.mp3',
      duration: 500
    },
    {
      id: 'boxing-right-hook',
      name: 'Правый хук',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/right-hook.mp3',
      duration: 500
    },
    {
      id: 'boxing-left-uppercut',
      name: 'Апперкот левый',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/left-uppercut.mp3',
      duration: 500
    },
    {
      id: 'boxing-right-uppercut',
      name: 'Апперкот правый',
      style: 'boxing',
      type: 'punch',
      audioUrl: 'assets/audio/right-uppercut.mp3',
      duration: 500
    },

    // Muay Thai moves (includes all boxing moves)
    {
      id: 'muaythai-low-kick',
      name: 'Лоу-кик',
      style: 'muaythai',
      type: 'kick',
      audioUrl: 'assets/audio/low-kick.mp3',
      duration: 500
    },
    {
      id: 'muaythai-mid-kick',
      name: 'Мид-кик',
      style: 'muaythai',
      type: 'kick',
      audioUrl: 'assets/audio/mid-kick.mp3',
      duration: 500
    },
    {
      id: 'muaythai-high-kick',
      name: 'Хай-кик',
      style: 'muaythai',
      type: 'kick',
      audioUrl: 'assets/audio/high-kick.mp3',
      duration: 500
    },
    {
      id: 'muaythai-teep',
      name: 'Теп (фронт-кик)',
      style: 'muaythai',
      type: 'kick',
      audioUrl: 'assets/audio/teep.mp3',
      duration: 500
    },
    {
      id: 'muaythai-knee',
      name: 'Колено',
      style: 'muaythai',
      type: 'knee',
      audioUrl: 'assets/audio/knee.mp3',
      duration: 500
    },
    {
      id: 'muaythai-elbow',
      name: 'Локоть',
      style: 'muaythai',
      type: 'elbow',
      audioUrl: 'assets/audio/elbow.mp3',
      duration: 500
    },

    // MMA moves (includes all previous moves)
    {
      id: 'mma-backfist',
      name: 'Бэкфист',
      style: 'mma',
      type: 'punch',
      audioUrl: 'assets/audio/backfist.mp3',
      duration: 500
    },
    {
      id: 'mma-jump-kick',
      name: 'Удар ногой в прыжке',
      style: 'mma',
      type: 'kick',
      audioUrl: 'assets/audio/jump-kick.mp3',
      duration: 500
    }
  ];

  getMovesForStyle(style: 'boxing' | 'muaythai' | 'mma'): Move[] {
    return this.moves.filter(move => {
      // For boxing, return only boxing moves
      if (style === 'boxing') {
        return move.style === 'boxing';
      }
      // For muaythai, return boxing and muaythai moves
      else if (style === 'muaythai') {
        return move.style === 'boxing' || move.style === 'muaythai';
      }
      // For mma, return all moves
      else {
        return true;
      }
    });
  }

  getMoveById(id: string): Move | undefined {
    return this.moves.find(move => move.id === id);
  }

  getAllMoves(): Move[] {
    return [...this.moves];
  }
}