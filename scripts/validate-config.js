#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Validates the configuration file and checks if all referenced sound files exist
 */
function validateConfig() {
    console.log('🔍 Validating configuration...');
    
    try {
        // Check if config.js exists
        const configPath = path.join(__dirname, '..', 'config.js');
        if (!fs.existsSync(configPath)) {
            console.error('❌ config.js file not found!');
            process.exit(1);
        }
        console.log('✅ config.js file exists');
        
        // Load and validate config structure
        const config = require(configPath);
        if (!config.soundGroups) {
            console.error('❌ Invalid config: soundGroups not found!');
            process.exit(1);
        }
        console.log('✅ Config structure is valid');
        
        // Check if sounds directory exists
        const soundsDir = path.join(__dirname, '..', 'sounds');
        if (!fs.existsSync(soundsDir)) {
            console.error('❌ sounds directory not found!');
            process.exit(1);
        }
        console.log('✅ sounds directory exists');
        
        // Validate each sound file
        let totalSounds = 0;
        let missingFiles = [];
        
        for (const [groupName, sounds] of Object.entries(config.soundGroups)) {
            console.log(`📂 Checking group: ${groupName}`);
            
            for (const sound of sounds) {
                totalSounds++;
                const soundPath = path.join(soundsDir, sound.value);
                
                if (!fs.existsSync(soundPath)) {
                    missingFiles.push({
                        group: groupName,
                        name: sound.name,
                        file: sound.value,
                        path: soundPath
                    });
                    console.log(`   ❌ Missing: ${sound.name} (${sound.value})`);
                } else {
                    console.log(`   ✅ Found: ${sound.name} (${sound.value})`);
                }
            }
        }
        
        // Summary
        console.log('\n📊 Validation Summary:');
        console.log(`🎶 Total sound files configured: ${totalSounds}`);
        console.log(`🚨 Missing files: ${missingFiles.length}`);
        
        if (missingFiles.length > 0) {
            console.log('\n❌ Missing sound files:');
            missingFiles.forEach(file => {
                console.log(`   - ${file.group}/${file.name}: ${file.file}`);
            });
            console.log('\n💡 Please add the missing files to the sounds directory or update the config.');
            process.exit(1);
        }
        
        console.log('\n🎉 Configuration validation passed! All files exist.');
        
    } catch (error) {
        console.error('❌ Error during validation:', error.message);
        process.exit(1);
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    validateConfig();
}

module.exports = validateConfig;
