const { SlashCommandBuilder } = require('@discordjs/builders');

const registerCommand = new SlashCommandBuilder()
    .setName('quit')
    .setDescription('Stops playback, leaves voice channel, and disconnects the bot');

async function execute(interaction, musicPlayer) {
    console.log("Received quit command");
    
    musicPlayer.quit();
    
    await interaction.reply("👋 Bot disconnected from voice channel. Goodbye!");
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
