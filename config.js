// To add a new sound, add it to the appropriate group in SoundGroups.
// Each group will become a subcommand, and each value must match the filename in the sounds folder.
module.exports = {
    soundGroups: {
        ambient: [
            { name: 'Forest Sounds', value: 'forest.ogg' },
            { name: 'Rain', value: 'rain.mp3' },
        ],
        music: [
            { name: 'Epic Battle', value: 'battle_theme.wav' },
            { name: 'Tavern', value: 'tavern_music.ogg' }
        ],
        effects: [
            { name: 'Explosion', value: 'boom.wav' },
            { name: 'Magic Spell', value: 'spell_cast.mp3' }
        ]
    }
};
