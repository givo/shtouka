// Audio Manager - handles preloading, playback, crossfade, iOS unlock

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.songs = new Map(); // zone id -> { buffer, source, gainNode }
    this.currentZoneId = null;
    this.masterVolume = 0.8;
    this.muted = false;
    this.masterGain = null;
    this.unlocked = false;
    this.loadingProgress = 0;
  }

  async init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.masterVolume;
    this.masterGain.connect(this.audioContext.destination);
  }

  async unlock() {
    if (this.unlocked) return;
    if (!this.audioContext) await this.init();

    try {
      if (this.audioContext.state === 'suspended') {
        // Use a timeout to prevent hanging
        await Promise.race([
          this.audioContext.resume(),
          new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
      }

      // Play a tiny silent buffer to unlock on iOS
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (e) {
      console.warn('Audio unlock failed:', e);
    }

    this.unlocked = true;
  }

  async preloadAll(zones, onProgress) {
    if (!this.audioContext) await this.init();

    const total = zones.length;
    let loaded = 0;

    const promises = zones.map(async (zone) => {
      try {
        const response = await fetch(zone.audioFile);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        this.songs.set(zone.id, {
          buffer: audioBuffer,
          source: null,
          gainNode: null,
        });

        loaded++;
        this.loadingProgress = loaded / total;
        if (onProgress) onProgress(loaded, total);
      } catch (err) {
        console.warn(`Failed to load audio for zone ${zone.id}:`, err);
        loaded++;
        this.loadingProgress = loaded / total;
        if (onProgress) onProgress(loaded, total);
      }
    });

    await Promise.all(promises);
  }

  play(zoneId, loop = true) {
    if (!this.audioContext || !this.songs.has(zoneId)) return;

    // Stop current if different
    if (this.currentZoneId && this.currentZoneId !== zoneId) {
      this.stop(this.currentZoneId);
    }

    const song = this.songs.get(zoneId);
    if (song.source) return; // Already playing

    const source = this.audioContext.createBufferSource();
    source.buffer = song.buffer;
    source.loop = loop;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.muted ? 0 : 1;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);

    song.source = source;
    song.gainNode = gainNode;
    this.currentZoneId = zoneId;

    source.onended = () => {
      song.source = null;
      song.gainNode = null;
    };
  }

  stop(zoneId) {
    const song = this.songs.get(zoneId);
    if (!song || !song.source) return;

    try {
      song.source.stop();
    } catch (e) {
      // Already stopped
    }
    song.source = null;
    song.gainNode = null;
  }

  fadeOut(zoneId, duration = 3) {
    const song = this.songs.get(zoneId);
    if (!song || !song.gainNode) return;

    const now = this.audioContext.currentTime;
    song.gainNode.gain.setValueAtTime(song.gainNode.gain.value, now);
    song.gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Stop after fade
    setTimeout(() => {
      this.stop(zoneId);
    }, duration * 1000 + 100);
  }

  crossfade(fromZoneId, toZoneId, duration = 1.5) {
    if (!this.audioContext) return;

    // Fade out current
    if (fromZoneId && this.songs.has(fromZoneId)) {
      this.fadeOut(fromZoneId, duration);
    }

    // Fade in next
    if (toZoneId && this.songs.has(toZoneId)) {
      const song = this.songs.get(toZoneId);

      const source = this.audioContext.createBufferSource();
      source.buffer = song.buffer;
      source.loop = true;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0;

      source.connect(gainNode);
      gainNode.connect(this.masterGain);

      source.start(0);

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.muted ? 0 : 1, now + duration);

      song.source = source;
      song.gainNode = gainNode;
      this.currentZoneId = toZoneId;

      source.onended = () => {
        song.source = null;
        song.gainNode = null;
      };
    }
  }

  setVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.currentZoneId) {
      const song = this.songs.get(this.currentZoneId);
      if (song && song.gainNode) {
        song.gainNode.gain.value = this.muted ? 0 : 1;
      }
    }
    return this.muted;
  }

  stopAll() {
    for (const [zoneId] of this.songs) {
      this.stop(zoneId);
    }
    this.currentZoneId = null;
  }

  destroy() {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default AudioManager;
