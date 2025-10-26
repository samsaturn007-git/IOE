# Music Files

Place your music files (.mp3, .wav, .ogg) in this directory.

## Usage

1. Add your music files to this folder (e.g., `track1.mp3`, `track2.mp3`, etc.)
2. Update the playlist in `src/components/MusicPlayer.js` to reference your files:

```javascript
const playlist = [
  { title: 'Your Song Title', artist: 'Artist Name', src: '/music/track1.mp3' },
  { title: 'Another Song', artist: 'Another Artist', src: '/music/track2.mp3' },
];
```

## Supported Formats

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)

## Note

For demo purposes, you can use any royalty-free music from sources like:
- YouTube Audio Library
- Free Music Archive
- Incompetech
