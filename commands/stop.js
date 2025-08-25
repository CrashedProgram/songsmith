const { SlashCommandBuilder } = require('@discordjs/builders');

const registerCommand = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the playback and clears the queue');

async function execute(interaction, musicPlayer) {
    console.log("Received stop command");
    
    const status = musicPlayer.getStatus();
    
    if (!status.isPlaying && status.queueLength === 0) {
        return interaction.reply({
            content: "❌ Nothing is currently playing!",
            ephemeral: true
        });
    }
    
    musicPlayer.stop();
    
    await interaction.reply("⏹️ Playback stopped and queue cleared!");
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
