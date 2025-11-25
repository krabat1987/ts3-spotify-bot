export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number; // in milliseconds
}

export interface BotConfig {
  teamspeak: {
    host: string;
    nickname: string;
    password?: string;
    channel?: string;
  };
  spotify: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken?: string;
  };
}
