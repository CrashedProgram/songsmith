# 🎵 Songsmith Discord Bot

A clean, organized Discord music bot for playing sound files in voice channels. Perfect for D&D-style background music and atmospheric soundscapes.

⚖️ **By installing this bot you agree that:**  

1. You actually own the rights to the audio files you use.
2. You will not complain when it crashes, lags, or suddenly decides `/stop` means “stop existing.”
3. You accept that “error handling” just means the bot will yell at you in a friendly way.
4. You acknowledge that all bugs are undocumented features.

## ✨ Features

- 🎶 Play audio files from organized categories with dynamic subcommands
- 🎤 Smart voice channel joining (manual with `/join` or automatic when playing)
- ⏯️ Queue management with automatic playback progression
- 🔄 Loop functionality - loops the last track in the queue automatically
- ⏭️ Skip to next song in queue with `/next`
- ⏹️ Stop playback and clear entire queue with `/stop`
- 👋 Complete disconnect with `/quit` (stops playback + leaves voice channel)
- 🎵 Rich status embed showing playback state, queue length, current track, and loop status
- 🚀 Clean, modular architecture with separate command and service layers
- ⚡ Automatic command registration and deployment
- 🛡️ Robust error handling with user-friendly messages
- 🔧 Configuration validation tools to check missing sound files

## 🛠️ Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Add your Discord bot token and client ID:

   ```env
   TOKEN=your_bot_token_here
   CLIENT_ID=your_application_client_id_here
   ```

   - Get these from the [Discord Developer Portal](https://discord.com/developers/applications)

3. **Add sound files:**
   - Place audio files in the `sounds/` directory
   - Update `config.js` to reference your files
   - **Supported formats:** OGG Opus (recommended for Discord), MP3, WAV
   - Make sure filenames match exactly what you specify in `config.js`

   **Example sounds directory structure:**

   ```text
   sounds/
     ├── song1.ogg
     ├── song2.mp3
     ├── song3.wav
     └── song4.mp3
   ```

4. **Start the bot:**

   ```bash
   npm start
   ```

## 🧰 Development Commands

- `npm run validate` - Validate configuration and check for missing sound files
- `npm run deploy` - Deploy slash commands to Discord (useful for development)
- `npm start` - Start the bot

## 📁 Project Structure

```text
songsmith/
├── services/          # Core bot services
│   ├── MusicPlayer.js  # Audio playback logic
│   └── CommandHandler.js # Command management
├── commands/          # Slash commands
│   ├── join.js       # Join voice channel manually
│   ├── play.js       # Play audio files with dynamic categories
│   ├── next.js       # Skip to next
│   ├── stop.js       # Stop playback and clear queue
│   ├── quit.js       # Complete disconnect
│   └── status.js     # Rich status embed
├── scripts/          # Utility scripts
│   ├── deploy-commands.js # Deploy slash commands to Discord
│   └── validate-config.js # Validate configuration and check files
├── sounds/           # Audio files directory
├── config.js         # Sound file configuration
├── main.js          # Bot entry point
└── package.json     # Dependencies and scripts
```

## 🎵 Commands

### Core Commands

- `/join` - Manually join your voice channel (bot joins automatically when playing if not connected)
- `/play <category> <sound>` - Play a sound file from organized categories
  - Categories are dynamically generated from your `config.js` file
  - Each category becomes a subcommand with its own sound choices
  - Automatically enables looping and adds to queue (loops only when queue is empty)
- `/next` - Skip to next song in queue (only works when music is playing)
- `/stop` - Stop playback, disable looping, and clear the entire queue
- `/quit` - Complete shutdown: stop playback, leave voice channel, and disconnect
- `/status` - Display rich embed with current playback status, queue info, and loop state

### Command Behavior

- **Auto-join**: Bot automatically joins your voice channel when you use `/play` if not already connected
- **Queue System**: Songs are added to a queue and play automatically in sequence
- **Looping**: When you play a song, looping is automatically enabled. The current track will repeat only after the entire queue is finished
- **Smart Validation**: Commands provide helpful error messages (not in voice channel, nothing playing, etc.)

## ⚙️ Configuration

The bot uses `config.js` to define sound categories and files. Each group becomes a separate subcommand under `/play`.

### Adding Sound Categories

Edit `config.js` to add new sound categories and files:

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
      effects: [
         { name: 'Explosion', value: 'boom.wav' },
         { name: 'Magic Spell', value: 'spell_cast.mp3' }
      ]
   }
};
```

### Dynamic Command Generation

- Each key in `soundGroups` becomes a subcommand (e.g., `/play ambient`, `/play music`)
- The `name` field is what users see in Discord's command picker
- The `value` field must match the exact filename in your `sounds/` directory
- Changes to `config.js` require restarting the bot to take effect

### Validation

Use the built-in validation script to check your configuration:

```bash
npm run validate
```

This will verify that all referenced sound files exist in the `sounds/` directory.

## 🔧 Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- FFmpeg (for audio processing)
- Hope and patience
- A Discord application with bot permissions
