function fadeOut(resource, { duration = 3000, steps = 30 } = {}) {
    return new Promise((resolve, reject) => {
        if (!resource || !resource.volume) {
            return reject(new Error('Audio resource does not support inline volume. Create it with inlineVolume: true.'));
        }

        const startVolume = resource.volume.volume; // current linear volume (0-1)
        if (startVolume <= 0) {
            return resolve(); // already silent
        }

        const interval = duration / steps;
        const decrement = startVolume / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newVolume = Math.max(0, startVolume - decrement * currentStep);
            resource.volume.setVolume(newVolume);

            if (currentStep >= steps) {
                clearInterval(timer);
                resource.volume.setVolume(0);
                resolve();
            }
        }, interval);
    });
}

module.exports = fadeOut;
