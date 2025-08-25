const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const registerCommand = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Shows current playback status and queue information');

async function execute(interaction, musicPlayer) {
    const status = musicPlayer.getStatus();
    
    const embed = new EmbedBuilder()
        .setTitle('🎵 Music Player Status')
        .setColor(status.isPlaying ? 0x00ff00 : 0xff0000)
        .addFields(
            {
                name: '▶️ Status',
                value: status.isPlaying ? 'Playing' : 'Stopped',
                inline: true
            },
            {
                name: '📋 Queue Length',
                value: status.queueLength.toString(),
                inline: true
            },
            {
                name: '🔁 Loop',
                value: status.loopEnabled ? 'Enabled' : 'Disabled',
                inline: true
            }
        );
    
    if (status.currentFile) {
        embed.addFields({
            name: '🎶 Current Track',
            value: status.currentFile,
            inline: false
        });
    }
    
    embed.setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
