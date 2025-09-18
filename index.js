require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Check if message starts with /audit
  const match = message.content.match(/^\/audit\s+(https?:\/\/[^\s]+)/);
  if (match) {
    const url = match[1];
    const user = `${message.author.username}#${message.author.discriminator}`;
    const payload = {
      url,
      user,
      message: message.content,
      discord_channel: message.channel.id
    };

    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, payload);
      await message.reply(`Got it, ${user}. Now send the checklist for:\n🔍 ${url}`);
    } catch (err) {
      console.error('❌ Failed to POST to n8n:', err.message);
      await message.reply(`⚠️ Couldn't contact n8n server.`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
