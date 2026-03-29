const { createAudioResource, StreamType, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');
const fadeOut = require('./fadeout');

class MusicPlayer {
    constructor() {
        this.player = createAudioPlayer();
        this.queue = [];
        this.isPlaying = false;
        this.lastFile = null;
        this.loopEnabled = false;
        this.connection = null;
        this.currentResource = null;
        
        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log('Audio finished, playing next...');
            this.playNext();
        });
        
        this.player.on('error', (error) => {
            console.error('Audio player error:', error);
            this.isPlaying = false;
        });
    }
    
    async joinChannel(voiceChannel) {
        try {
            this.connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            
            this.connection.subscribe(this.player);
            console.log(`Joined voice channel: ${voiceChannel.name}`);
            return true;
        } catch (error) {
            console.error('Failed to join voice channel:', error);
            return false;
        }
    }
    
    addToQueue(filename) {
        this.queue.push(filename);
        console.log(`Added "${filename}" to queue. Queue length: ${this.queue.length}`);
        
        if (!this.isPlaying) {
            this.playNext();
        }
    }
    
    playNext() {
        if (this.queue.length === 0) {
            if (this.loopEnabled && this.lastFile) {
                console.log(`Looping: ${this.lastFile}`);
                this.queue.push(this.lastFile);
            } else {
                this.isPlaying = false;
                console.log('Queue empty, stopping playback');
                return;
            }
        }
        
        const filename = this.queue.shift();
        this.lastFile = filename;
        this.isPlaying = true;
        
        try {
            const filePath = path.join(__dirname, '../sounds', filename);
            const resource = createAudioResource(createReadStream(filePath), {
                inputType: StreamType.OggOpus,
                inlineVolume: true
            });
            
            this.currentResource = resource;
            this.player.play(resource);
            console.log(`Now playing: ${filename}`);
        } catch (error) {
            console.error(`Failed to play ${filename}:`, error);
            this.playNext(); // Try next song
        }
    }
    
    skip() {
        if (this.isPlaying) {
            this.player.stop();
            return true;
        }
        return false;
    }
    
    stop() {
        this.queue.length = 0;
        this.isPlaying = false;
        this.loopEnabled = false;
        this.lastFile = null;
        this.currentResource = null;
        this.player.stop();
    }

    /**
     * Fades out the current track then either advances to the next song or stops.
     * @param {object} [options] - Options forwarded to the fadeout module (duration, steps).
     * @returns {Promise<boolean>} true if fade was performed, false if nothing was playing.
     */
    async fadeOutCurrent(options) {
        if (!this.isPlaying || !this.currentResource) {
            return false;
        }

        try {
            await fadeOut(this.currentResource, options);
        } catch (error) {
            console.error('Fade-out error:', error);
        }

        this.currentResource = null;

        // If the queue has more songs, skip to next; otherwise stop completely.
        if (this.queue.length > 0) {
            this.player.stop(); // triggers Idle -> playNext
        } else {
            this.stop();
        }

        return true;
    }
    
    quit() {
        this.stop();
        if (this.connection) {
            this.connection.destroy();
            this.connection = null;
        }
    }
    
    setLoop(enabled) {
        this.loopEnabled = enabled;
        if (!enabled) {
            this.lastFile = null;
        }
        console.log(`Loop ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            queueLength: this.queue.length,
            currentFile: this.lastFile,
            loopEnabled: this.loopEnabled
        };
    }
}

module.exports = MusicPlayer;
