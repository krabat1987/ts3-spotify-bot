# TS3 Spotify Bot

A TeamSpeak 3 bot that plays Spotify songs with queue management capabilities. This bot connects to a TeamSpeak 3 server and listens for commands to manage and play songs from Spotify.

## Features

- Connect to TeamSpeak 3 servers
- Play Spotify songs via URL
- Queue management system
- Multiple playback commands
- Automatic progression through queue

## Commands

- `!play` - Play the first song in the queue
- `!add <spotify_url>` - Add a song to the queue using a Spotify URL
- `!clear` - Clear the entire queue
- `!next` - Skip to the next song in the queue
- `!queue` - Display all songs in the queue with playtime
- `!delete <position>` - Remove a song at the specified position in the queue

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TeamSpeak 3 Server with ServerQuery access
- Spotify Developer Account

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ts3-spotify-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Note your `Client ID` and `Client Secret`
4. Add `http://localhost:8888/callback` as a Redirect URI in your app settings

### 4. Configure TeamSpeak 3

You need ServerQuery access to your TeamSpeak 3 server:

1. Connect to your TS3 server's ServerQuery port (default: 10011)
2. Obtain the ServerQuery login credentials
3. Note your server's hostname/IP address

### 5. Configuration

You can configure the bot using either a `config.json` file or environment variables.

#### Option A: Using config.json

Copy the example configuration:

```bash
cp config.json.example config.json
```

Edit `config.json` with your credentials:

```json
{
  "teamspeak": {
    "host": "your-ts3-server.com",
    "queryport": 10011,
    "serverport": 9987,
    "nickname": "SpotifyBot",
    "password": "your_server_query_password",
    "channel": "Music"
  },
  "spotify": {
    "clientId": "your_spotify_client_id",
    "clientSecret": "your_spotify_client_secret",
    "redirectUri": "http://localhost:8888/callback"
  }
}
```

**TeamSpeak Configuration Fields:**
- `host` - TeamSpeak server hostname or IP
- `queryport` - ServerQuery port (default: 10011)
- `serverport` - Server voice port (default: 9987)
- `nickname` - Bot's display name
- `password` - ServerQuery password
- `channel` - Channel name to join (optional)


#### Option B: Using environment variables

Copy the example .env file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
TS3_HOST=your-ts3-server.com
TS3_QUERYPORT=10011
TS3_SERVERPORT=9987
TS3_NICKNAME=SpotifyBot
TS3_PASSWORD=your_server_query_password
TS3_CHANNEL=Music

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
```

## Building and Running

### Development Mode

```bash
npm run dev
```

### Production Mode

Build the TypeScript code:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

## Usage

Once the bot is running and connected to your TeamSpeak server:

1. Join the same channel as the bot (or the configured channel)
2. Use the commands in the channel chat:

```
!add https://open.spotify.com/track/TRACK_ID
!queue
!play
```

### Example Session

```
User: !add https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
Bot: Added to queue: Mr. Brightside - The Killers

User: !add https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b
Bot: Added to queue: Blinding Lights - The Weeknd

User: !queue
Bot: Current queue:
1: Mr. Brightside - The Killers
2: Blinding Lights - The Weeknd
Play time: 0:06:42

User: !play
Bot: Now playing: Mr. Brightside - The Killers
```

## Queue Display Format

The `!queue` command displays songs in the following format:

```
<position>: <title> - <artist>
```

The last line shows the total playtime in `h:mm:ss` format:

```
Play time: 1:23:45
```

## Architecture

The application is structured into several modules:

- `index.ts` - Main entry point and initialization
- `types.ts` - TypeScript type definitions
- `config.ts` - Configuration loading
- `queue.ts` - Queue management system
- `spotify.ts` - Spotify API integration
- `teamspeak.ts` - TeamSpeak 3 connection and event handling
- `commands.ts` - Command parsing and execution

## Limitations

- This bot uses Spotify's Web API which provides track metadata but does not stream audio. The actual audio playback functionality is simulated with timeouts. For real audio playback, you would need to integrate with a music playback service or library.
- The bot requires ServerQuery access to the TeamSpeak server, which typically requires administrator privileges.

## Troubleshooting

### Connection Issues

- Verify your TeamSpeak ServerQuery credentials
- Check that port 10011 is accessible on your TS3 server
- Ensure the bot has permission to connect and send messages

### Spotify Issues

- Verify your Spotify Client ID and Secret are correct
- Check that the redirect URI matches in both your config and Spotify app settings
- Ensure your Spotify app is not in development mode restrictions

### Bot Not Responding

- Check the console output for errors
- Verify the bot is in the same channel as you
- Ensure commands start with `!` prefix

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
