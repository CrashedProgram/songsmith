const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(musicPlayer) {
        this.commands = new Map();
        this.musicPlayer = musicPlayer;
        this.loadCommands();
    }
    
    loadCommands() {
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.execute) {
                this.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            }
        }
    }
    
    getCommandsData() {
        return Array.from(this.commands.values()).map(command => command.data);
    }
    
    async handleInteraction(interaction) {
        if (!interaction.isCommand()) return;
        
        const command = this.commands.get(interaction.commandName);
        if (!command) {
            console.warn(`Unknown command: ${interaction.commandName}`);
            return;
        }
        
        try {
            await command.execute(interaction, this.musicPlayer);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            
            const errorMessage = 'There was an error executing this command!';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
}

module.exports = CommandHandler;
