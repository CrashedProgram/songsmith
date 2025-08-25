#!/usr/bin/env node
require('dotenv/config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const CommandHandler = require('../services/commandHandler');

/**
 * Deploys slash commands to Discord and immediately shuts down
 */
async function deployCommands() {
    console.log('🚀 Deploying commands to Discord...');
    
    try {
        // Validate environment variables
        if (!process.env.token) {
            console.error('❌ Discord bot token not found in environment variables!');
            console.error('💡 Make sure you have a .env file with token=YOUR_BOT_TOKEN');
            process.exit(1);
        }
        
        if (!process.env.CLIENT_ID) {
            console.error('❌ CLIENT_ID not found in environment variables!');
            console.error('💡 Make sure you have a .env file with CLIENT_ID=YOUR_CLIENT_ID');
            process.exit(1);
        }
        
        console.log('✅ Environment variables validated');
        
        // Initialize REST client
        const rest = new REST({ version: '10' }).setToken(process.env.token);
        
        // Get commands from command handler
        const commandHandler = new CommandHandler(null); // No music player needed for command registration
        const commands = commandHandler.getCommandsData();
        
        console.log(`📝 Found ${commands.length} commands to deploy`);
        
        // Deploy commands
        console.log('🔄 Uploading commands to Discord...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log(`✅ Successfully deployed ${commands.length} slash commands!`);
        console.log('🎯 Commands are now available across all servers where the bot is installed');
        
        // List deployed commands
        if (commands.length > 0) {
            console.log('\n📋 Deployed commands:');
            commands.forEach(cmd => {
                console.log(`   - /${cmd.name}: ${cmd.description}`);
            });
        }
        
        console.log('\n🛑 Deployment complete, shutting down...');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Failed to deploy commands:', error);
        
        if (error.code === 50001) {
            console.error('💡 This error usually means the bot token is invalid or the bot lacks permissions');
        } else if (error.code === 10002) {
            console.error('💡 This error usually means the CLIENT_ID is invalid');
        } else if (error.status === 401) {
            console.error('💡 Authentication failed - check your bot token');
        }
        
        process.exit(1);
    }
}

// Run deployment if this script is executed directly
if (require.main === module) {
    deployCommands();
}

module.exports = deployCommands;
