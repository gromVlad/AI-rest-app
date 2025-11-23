import { Injectable } from '@angular/core';

export interface AudioItem {
  url: string;
  type: 'move' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioItem[] = [];
  private isPlaying = false;
  private activeAudio: HTMLAudioElement | null = null;

  constructor() {
    // Initialize Web Audio API context if available
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async preloadAudio(audioUrls: string[]): Promise<void> {
    const promises = audioUrls.map(url => this.preloadSingleAudio(url));
    await Promise.all(promises);
  }

  private preloadSingleAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      
      audio.addEventListener('canplaythrough', () => resolve());
      audio.addEventListener('error', () => reject());
    });
  }

  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }

      this.activeAudio = new Audio(audioUrl);
      
      this.activeAudio.addEventListener('ended', () => {
        resolve();
        this.activeAudio = null;
      });
      
      this.activeAudio.addEventListener('error', (e) => {
        console.error('Error playing audio:', e);
        reject(e);
        this.activeAudio = null;
      });

      // Play the audio
      this.activeAudio.play().catch(error => {
        console.error('Error starting audio:', error);
        reject(error);
      });
    });
  }

  async playMoveAudio(moveName: string): Promise<void> {
    // In a real implementation, you would map the move name to its audio file
    // For now, we'll use a generic approach
    const audioUrl = `assets/audio/${moveName.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    return this.playAudio(audioUrl);
  }

  async playSystemAudio(systemCommand: 'start' | 'pause' | 'stop' | 'five-seconds'): Promise<void> {
    // Map system commands to audio files
    const audioMap: Record<string, string> = {
      'start': 'assets/audio/round-start.mp3',
      'pause': 'assets/audio/pause.mp3',
      'stop': 'assets/audio/stop.mp3',
      'five-seconds': 'assets/audio/five-seconds.mp3'
    };
    
    const audioUrl = audioMap[systemCommand];
    if (audioUrl) {
      return this.playAudio(audioUrl);
    } else {
      console.warn(`No audio file mapped for system command: ${systemCommand}`);
      return Promise.resolve();
    }
  }

  addToQueue(audioItem: AudioItem): void {
    this.audioQueue.push(audioItem);
    if (!this.isPlaying) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioItem = this.audioQueue.shift()!;

    try {
      if (audioItem.type === 'move') {
        await this.playMoveAudio(audioItem.url);
      } else {
        await this.playSystemAudio(audioItem.url as any);
      }
    } catch (error) {
      console.error('Error playing audio from queue:', error);
    }

    // Process the next item in the queue
    await this.processQueue();
  }

  stopAllAudio(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    
    // Clear the queue
    this.audioQueue = [];
    this.isPlaying = false;
  }

  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}