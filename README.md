# Songsmith

A Discord music bot for playing sound files in voice channels.

## Features

- Play audio files organized by category
- Automatic voice channel joining when playing
- Queue system with automatic playback
- Loop functionality for repeated tracks
- Skip, stop, and quit commands
- Status display showing current playback and queue
- Configuration validation
- Modular code structure

## Setup

1. Install dependencies: `npm install`

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Add your Discord bot token and client ID from the [Discord Developer Portal](https://discord.com/developers/applications)

   ```env
   TOKEN=your_bot_token_here
   CLIENT_ID=your_application_client_id_here
   ```

3. Add sound files to the `sounds/` directory:
   - Update `config.js` to reference your files
   - Supported formats: OGG Opus (recommended), MP3, WAV
   - Filenames must match exactly what you specify in `config.js`

4. Start the bot: `npm start`

**Other commands:**

- `npm run validate` - Check configuration and verify sound files exist
- `npm run deploy` - Deploy slash commands to Discord

## Project Structure

```text
songsmith/
├── services/          # Core bot services
│   ├── MusicPlayer.js  # Audio playback logic
│   └── CommandHandler.js # Command management
├── commands/          # Slash commands
│   ├── join.js       # Join voice channel
│   ├── play.js       # Play audio files
│   ├── next.js       # Skip to next
│   ├── stop.js       # Stop playback
│   ├── quit.js       # Disconnect
│   └── status.js     # Show status
├── scripts/          # Utility scripts
│   ├── deploy-commands.js # Deploy slash commands to Discord
│   └── validate-config.js # Validate configuration
├── sounds/           # Audio files directory
├── config.js         # Sound file configuration
├── main.js          # Bot entry point
└── package.json     # Dependencies and scripts
```

## Commands

- `/join` - Join your voice channel
- `/play <category> <sound>` - Play a sound file. Categories come from `config.js`
- `/next` - Skip to the next track
- `/stop` - Stop playback and clear the queue
- `/quit` - Stop playback and leave the voice channel
- `/status` - Show current playback and queue status

The bot automatically joins your voice channel when you use `/play`. Songs are queued and play in sequence. Looping is enabled when you play a song, so the last track repeats after the queue finishes.

## Configuration

Edit `config.js` to add sound categories and files. Each category becomes a subcommand under `/play`:

```javascript
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
   }
};
```

The `name` field is what appears in Discord. The `value` must match the filename in `sounds/`. Run `npm run validate` to check that all files exist.

## Requirements

- Node.js 16.9.0+
- Discord.js v14
- FFmpeg
- A Discord application with bot permissions
