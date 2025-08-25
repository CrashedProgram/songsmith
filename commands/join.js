const { SlashCommandBuilder } = require('@discordjs/builders');

const registerCommand = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your voice channel and stays idle');

async function execute(interaction, musicPlayer) {
    console.log("Received 'join' command");
    
    const userChannel = interaction.member.voice.channel;
    if (!userChannel) {
        return interaction.reply({
            content: "❌ Please join a voice channel first!",
            ephemeral: true
        });
    }

    // Check if bot is already connected to a voice channel
    if (musicPlayer.connection) {
        return interaction.reply({
            content: "🔗 Already connected to a voice channel!",
            ephemeral: true
        });
    }

    // Join the voice channel
    const joined = await musicPlayer.joinChannel(userChannel);
    if (!joined) {
        return interaction.reply({
            content: "❌ Failed to join voice channel!",
            ephemeral: true
        });
    }

    await interaction.reply(`✅ Joined **${userChannel.name}** and ready to serve!`);
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
