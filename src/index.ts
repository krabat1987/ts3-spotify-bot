import * as dotenv from 'dotenv';
import { loadConfig } from './config';
import { QueueManager } from './queue';
import { SpotifyManager } from './spotify';
import { CommandHandler } from './commands';
import { TeamspeakBot } from './teamspeak';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Starting TS3 Spotify Bot...');

    // Load configuration
    const config = loadConfig();
    console.log('Configuration loaded');

    // Initialize queue manager
    const queueManager = new QueueManager();
    console.log('Queue manager initialized');

    // Initialize Spotify manager
    const spotifyManager = new SpotifyManager(
      config.spotify.clientId,
      config.spotify.clientSecret,
      config.spotify.redirectUri,
      config.spotify.refreshToken
    );

    // Authenticate with Spotify
    await spotifyManager.authenticate();
    console.log('Spotify authenticated');

    // Initialize command handler
    const commandHandler = new CommandHandler(queueManager, spotifyManager);
    console.log('Command handler initialized');

    // Initialize and connect TeamSpeak bot
    const teamspeakBot = new TeamspeakBot(config, commandHandler);
    await teamspeakBot.connect();

    console.log('Bot is ready! Listening for commands...');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await teamspeakBot.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nShutting down...');
      await teamspeakBot.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
