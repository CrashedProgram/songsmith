const { SlashCommandBuilder } = require('@discordjs/builders');
const { soundGroups } = require('../config.js');

// Build the slash command with subcommands for each group
const registerCommand = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a sound');

// Dynamically add subcommands for each group
Object.entries(soundGroups).forEach(([group, choices]) => {
    registerCommand.addSubcommand(sub =>
        sub.setName(group)
            .setDescription(`Play a sound from the ${group} group`)
            .addStringOption(option =>
                option.setName('sound')
                    .setDescription('Choose the sound to play')
                    .setRequired(true)
                    .addChoices(...choices)
            )
    );
});

async function execute(interaction, musicPlayer) {
    console.log("Received 'play' command");
    
    const userChannel = interaction.member.voice.channel;
    if (!userChannel) {
        return interaction.reply({
            content: "❌ Please join a voice channel first!",
            ephemeral: true
        });
    }

    // Join the voice channel if not already connected
    if (!musicPlayer.connection) {
        const joined = await musicPlayer.joinChannel(userChannel);
        if (!joined) {
            return interaction.reply({
                content: "❌ Failed to join voice channel!",
                ephemeral: true
            });
        }
    }

    const subcommand = interaction.options.getSubcommand();
    const soundFile = interaction.options.getString('sound');
    
    // Enable looping and add to queue
    musicPlayer.setLoop(true);
    musicPlayer.addToQueue(soundFile);
    
    const status = musicPlayer.getStatus();
    const queuePosition = status.queueLength === 0 ? "Now playing" : `Position ${status.queueLength} in queue`;
    
    await interaction.reply({
        content: `🎵 **${soundFile}** added to queue!\n📊 ${queuePosition}`
    });
}

module.exports = {
    data: registerCommand.toJSON(),
    execute
};