const { SlashCommandBuilder } = require('@discordjs/builders');

const registerCommand = new SlashCommandBuilder()
    .setName('next')
    .setDescription('Skips to the next song in queue');

async function execute(interaction, musicPlayer) {
    console.log("Received next command");
    
    const status = musicPlayer.getStatus();
    
    if (!status.isPlaying) {
        return interaction.reply({
            content: "❌ No song is currently playing!",
            ephemeral: true
        });
    }
    
    const skipped = musicPlayer.skip();
    
    if (skipped) {
        await interaction.reply("⏭️ Skipped to next song!");
    } else {
        await interaction.reply({
            content: "❌ Failed to skip song!",
            ephemeral: true
        });
    }
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
