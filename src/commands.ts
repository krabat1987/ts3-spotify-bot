import { QueueManager } from './queue';
import { SpotifyManager } from './spotify';

export class CommandHandler {
  private queueManager: QueueManager;
  private spotifyManager: SpotifyManager;
  private isPlaying: boolean = false;

  constructor(queueManager: QueueManager, spotifyManager: SpotifyManager) {
    this.queueManager = queueManager;
    this.spotifyManager = spotifyManager;
  }

  /**
   * Handle incoming messages and execute commands
   */
  async handleMessage(message: string, sendResponse: (response: string) => void): Promise<void> {
    const trimmedMessage = message.trim();

    if (!trimmedMessage.startsWith('!')) {
      return;
    }

    const parts = trimmedMessage.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (command) {
        case '!play':
          await this.handlePlay(sendResponse);
          break;
        case '!add':
          await this.handleAdd(args, sendResponse);
          break;
        case '!clear':
          this.handleClear(sendResponse);
          break;
        case '!next':
          await this.handleNext(sendResponse);
          break;
        case '!queue':
          this.handleQueue(sendResponse);
          break;
        case '!delete':
          this.handleDelete(args, sendResponse);
          break;
        default:
          // Unknown command, ignore
          break;
      }
    } catch (error) {
      console.error('Error handling command:', error);
      sendResponse('An error occurred while processing your command.');
    }
  }

  /**
   * !play - Play the first song in the queue
   */
  private async handlePlay(sendResponse: (response: string) => void): Promise<void> {
    if (this.isPlaying) {
      sendResponse('Already playing!');
      return;
    }

    if (this.queueManager.isEmpty()) {
      sendResponse('Queue is empty. Add songs with !add <spotify_url>');
      return;
    }

    const song = this.queueManager.next();
    if (!song) {
      sendResponse('No songs in queue.');
      return;
    }

    this.queueManager.setCurrentlyPlaying(song);
    this.isPlaying = true;
    sendResponse(`Now playing: ${song.title} - ${song.artist}`);

    // Simulate playback (in a real implementation, this would actually play audio)
    setTimeout(() => {
      this.isPlaying = false;
      this.queueManager.setCurrentlyPlaying(null);

      // Auto-play next song if available
      if (!this.queueManager.isEmpty()) {
        this.handlePlay(sendResponse);
      }
    }, song.duration);
  }

  /**
   * !add <spotify_url> - Add a song to the queue
   */
  private async handleAdd(args: string[], sendResponse: (response: string) => void): Promise<void> {
    if (args.length === 0) {
      sendResponse('Usage: !add <spotify_url>');
      return;
    }

    const url = args[0];
    const song = await this.spotifyManager.getSongFromUrl(url);

    if (!song) {
      sendResponse('Invalid Spotify URL or unable to fetch song information.');
      return;
    }

    this.queueManager.add(song);
    sendResponse(`Added to queue: ${song.title} - ${song.artist}`);
  }

  /**
   * !clear - Clear the queue completely
   */
  private handleClear(sendResponse: (response: string) => void): void {
    this.queueManager.clear();
    sendResponse('Queue cleared.');
  }

  /**
   * !next - Play next song in queue
   */
  private async handleNext(sendResponse: (response: string) => void): Promise<void> {
    if (!this.isPlaying) {
      sendResponse('Nothing is currently playing. Use !play to start.');
      return;
    }

    // Stop current playback and play next
    this.isPlaying = false;
    this.queueManager.setCurrentlyPlaying(null);

    if (this.queueManager.isEmpty()) {
      sendResponse('No more songs in queue.');
      return;
    }

    await this.handlePlay(sendResponse);
  }

  /**
   * !queue - List songs in queue
   */
  private handleQueue(sendResponse: (response: string) => void): void {
    const queue = this.queueManager.getQueue();

    if (queue.length === 0) {
      sendResponse('Queue is empty.');
      return;
    }

    let response = 'Current queue:\n';
    queue.forEach((song, index) => {
      response += `${index + 1}: ${song.title} - ${song.artist}\n`;
    });

    const totalPlaytime = this.queueManager.getTotalPlaytime();
    response += `Play time: ${this.queueManager.formatPlaytime(totalPlaytime)}`;

    sendResponse(response);
  }

  /**
   * !delete <number> - Delete song at position
   */
  private handleDelete(args: string[], sendResponse: (response: string) => void): void {
    if (args.length === 0) {
      sendResponse('Usage: !delete <number>');
      return;
    }

    const position = parseInt(args[0], 10);
    if (isNaN(position)) {
      sendResponse('Invalid position number.');
      return;
    }

    const success = this.queueManager.delete(position);
    if (success) {
      sendResponse(`Deleted song at position ${position}.`);
    } else {
      sendResponse(`No song at position ${position}.`);
    }
  }
}
