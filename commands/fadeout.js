const { SlashCommandBuilder } = require('@discordjs/builders');

const registerCommand = new SlashCommandBuilder()
    .setName('fadeout')
    .setDescription('Fades out the current song, then plays next or stops')
    .addIntegerOption(option =>
        option.setName('duration')
            .setDescription('Fade duration in seconds (default: 3)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(30)
    );

async function execute(interaction, musicPlayer) {
    console.log("Received fadeout command");

    const status = musicPlayer.getStatus();

    if (!status.isPlaying) {
        return interaction.reply({
            content: "❌ Nothing is currently playing!",
            ephemeral: true
        });
    }

    const durationSec = interaction.options.getInteger('duration') ?? 3;
    const durationMs = durationSec * 1000;

    await interaction.reply(`🔉 Fading out over ${durationSec}s…`);

    const faded = await musicPlayer.fadeOutCurrent({ duration: durationMs });

    if (faded) {
        const newStatus = musicPlayer.getStatus();
        if (newStatus.isPlaying) {
            await interaction.editReply(`🔇 Fade complete — now playing next track!`);
        } else {
            await interaction.editReply(`🔇 Fade complete — playback stopped.`);
        }
    } else {
        await interaction.editReply("❌ Could not fade out (nothing playing).");
    }
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};
