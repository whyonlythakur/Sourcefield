// Discord OAuth2 + NextAuth configuration
// TODO: implement next-auth Discord provider

export const DISCORD_AUTH_CONFIG = {
  clientId: process.env.DISCORD_CLIENT_ID || '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  authorization: { params: { scope: 'identify guilds' } },
};
