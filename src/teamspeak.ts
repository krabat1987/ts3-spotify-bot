import { TeamSpeak, TextMessageTargetMode } from 'ts3-nodejs-library';
import { BotConfig } from './types';
import { CommandHandler } from './commands';

export class TeamspeakBot {
  private teamspeak: TeamSpeak | null = null;
  private commandHandler: CommandHandler;
  private config: BotConfig;

  constructor(config: BotConfig, commandHandler: CommandHandler) {
    this.config = config;
    this.commandHandler = commandHandler;
  }

  /**
   * Connect to the TeamSpeak server
   */
  async connect(): Promise<void> {
    try {
      console.log(`Connecting to TeamSpeak server at ${this.config.teamspeak.host}...`);

      this.teamspeak = await TeamSpeak.connect({
        host: this.config.teamspeak.host,
        queryport: this.config.teamspeak.queryport || 10011,
        serverport: this.config.teamspeak.serverport || 9987,
        username: 'serveradmin',
        password: this.config.teamspeak.password || '',
        nickname: this.config.teamspeak.nickname
      });

      console.log('Connected to TeamSpeak server!');

      // Set up event handlers
      this.setupEventHandlers();

      // Move to channel if specified
      if (this.config.teamspeak.channel) {
        await this.moveToChannel(this.config.teamspeak.channel);
      }
    } catch (error) {
      console.error('Failed to connect to TeamSpeak server:', error);
      throw error;
    }
  }

  /**
   * Set up event handlers for TeamSpeak events
   */
  private setupEventHandlers(): void {
    if (!this.teamspeak) {
      return;
    }

    // Handle text messages
    this.teamspeak.on('textmessage', (event) => {
      const message = event.msg;
      console.log(`Received message: ${message}`);

      // Handle the command
      this.commandHandler.handleMessage(message, (response) => {
        this.sendMessage(response, event.invoker.clid);
      });
    });

    // Handle client connect
    this.teamspeak.on('clientconnect', (event) => {
      console.log(`Client connected: ${event.client?.nickname}`);
    });

    // Handle client disconnect
    this.teamspeak.on('clientdisconnect', (event) => {
      console.log(`Client disconnected: ${event.client?.nickname}`);
    });

    // Handle errors
    this.teamspeak.on('error', (error) => {
      console.error('TeamSpeak error:', error);
    });

    // Handle close
    this.teamspeak.on('close', () => {
      console.log('Connection to TeamSpeak server closed');
    });

    console.log('Event handlers set up');
  }

  /**
   * Send a message to a client or channel
   */
  private async sendMessage(message: string, targetId?: string): Promise<void> {
    if (!this.teamspeak) {
      return;
    }

    try {
      const me = await this.teamspeak.whoami();

      if (targetId) {
        // Send private message to specific client
        await this.teamspeak.sendTextMessage(targetId as any, TextMessageTargetMode.CLIENT, message);
      } else if (me.channelId) {
        // Send to current channel
        await this.teamspeak.sendTextMessage(me.channelId as any, TextMessageTargetMode.CHANNEL, message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  /**
   * Move bot to a specific channel
   */
  private async moveToChannel(channelName: string): Promise<void> {
    if (!this.teamspeak) {
      return;
    }

    try {
      const channels = await this.teamspeak.channelList();
      const targetChannel = channels.find(channel => channel.name === channelName);

      if (targetChannel) {
        const me = await this.teamspeak.whoami();
        await this.teamspeak.clientMove(me.clientId, targetChannel.cid);
        console.log(`Moved to channel: ${channelName}`);
      } else {
        console.warn(`Channel not found: ${channelName}`);
      }
    } catch (error) {
      console.error('Failed to move to channel:', error);
    }
  }

  /**
   * Disconnect from the TeamSpeak server
   */
  async disconnect(): Promise<void> {
    if (this.teamspeak) {
      await this.teamspeak.quit();
      this.teamspeak = null;
      console.log('Disconnected from TeamSpeak server');
    }
  }
}
