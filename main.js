require('dotenv/config');
const { Client, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const MusicPlayer = require('./services/musicPlayer');
const CommandHandler = require('./services/commandHandler');

class SongsmithBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });
        
        this.musicPlayer = new MusicPlayer();
        this.commandHandler = new CommandHandler(this.musicPlayer);
        this.rest = new REST({ version: '10' }).setToken(process.env.token);
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`✅ ${this.client.user.tag} is online!`);
            console.log(`🎵 Serving ${this.client.guilds.cache.size} servers`);
        });
        
        this.client.on('interactionCreate', async (interaction) => {
            await this.commandHandler.handleInteraction(interaction);
        });
        
        this.client.on('error', (error) => {
            console.error('Discord client error:', error);
        });
        
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down bot...');
            this.musicPlayer.quit();
            this.client.destroy();
            process.exit(0);
        });
    }
    
    async registerCommands() {
        try {
            console.log('🔄 Refreshing slash commands...');
            const commands = this.commandHandler.getCommandsData();
            
            await this.rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            
            console.log(`✅ Successfully registered ${commands.length} commands`);
        } catch (error) {
            console.error('❌ Failed to register commands:', error);
            throw error;
        }
    }
    
    async start() {
        try {
            await this.registerCommands();
            await this.client.login(process.env.token);
        } catch (error) {
            console.error('❌ Failed to start bot:', error);
            process.exit(1);
        }
    }
}

// Start the bot
const bot = new SongsmithBot();
bot.start();