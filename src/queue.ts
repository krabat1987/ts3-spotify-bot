import { Song } from './types';

export class QueueManager {
  private queue: Song[] = [];
  private currentlyPlaying: Song | null = null;

  /**
   * Add a song to the queue
   */
  add(song: Song): void {
    this.queue.push(song);
  }

  /**
   * Get the next song from the queue
   */
  next(): Song | null {
    return this.queue.shift() || null;
  }

  /**
   * Clear the entire queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Delete a song at a specific position (1-indexed)
   */
  delete(position: number): boolean {
    if (position < 1 || position > this.queue.length) {
      return false;
    }
    this.queue.splice(position - 1, 1);
    return true;
  }

  /**
   * Get all songs in the queue
   */
  getQueue(): Song[] {
    return [...this.queue];
  }

  /**
   * Get the total playtime of all songs in the queue
   */
  getTotalPlaytime(): number {
    return this.queue.reduce((total, song) => total + song.duration, 0);
  }

  /**
   * Format playtime in h:mm:ss format
   */
  formatPlaytime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');

    return `${hours}:${mm}:${ss}`;
  }

  /**
   * Get the currently playing song
   */
  getCurrentlyPlaying(): Song | null {
    return this.currentlyPlaying;
  }

  /**
   * Set the currently playing song
   */
  setCurrentlyPlaying(song: Song | null): void {
    this.currentlyPlaying = song;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }
}
