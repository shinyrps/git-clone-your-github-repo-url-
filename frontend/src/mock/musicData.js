// Mock data for Shinyfy - will be replaced with real API data later

export const mockSongs = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    durationSeconds: 200,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    youtubeId: 'fHI8X4OXluQ',
    genre: 'Pop',
    region: 'Global',
    plays: 3400000000,
    releaseYear: 2020
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: '3:53',
    durationSeconds: 233,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    youtubeId: 'JGwWNGJdvx8',
    genre: 'Pop',
    region: 'Global',
    plays: 3200000000,
    releaseYear: 2017
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    durationSeconds: 203,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    youtubeId: 'TUVcZfQe-Kw',
    genre: 'Pop',
    region: 'Global',
    plays: 1200000000,
    releaseYear: 2020
  },
  {
    id: '4',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: '3:50',
    durationSeconds: 230,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    youtubeId: '34Na4j8AVgA',
    genre: 'R&B',
    region: 'North America',
    plays: 2800000000,
    releaseYear: 2016
  },
  {
    id: '5',
    title: 'Don\'t Start Now',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:03',
    durationSeconds: 183,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    youtubeId: 'oygrmJFKYZY',
    genre: 'Disco Pop',
    region: 'Europe',
    plays: 1500000000,
    releaseYear: 2019
  },
  {
    id: '6',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:35',
    durationSeconds: 215,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    youtubeId: 'XXYlFuWEuKI',
    genre: 'Synth Pop',
    region: 'Global',
    plays: 2100000000,
    releaseYear: 2020
  },
  {
    id: '7',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: '2:47',
    durationSeconds: 167,
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop',
    youtubeId: 'H5v3kku4y6Q',
    genre: 'Pop Rock',
    region: 'Global',
    plays: 2500000000,
    releaseYear: 2022
  },
  {
    id: '8',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    duration: '3:18',
    durationSeconds: 198,
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop',
    youtubeId: 'tQ0yjYUFKAE',
    genre: 'R&B',
    region: 'North America',
    plays: 1800000000,
    releaseYear: 2021
  }
];

export const mockPlaylists = [
  {
    id: 'p1',
    name: 'Today\'s Top Hits',
    description: 'The hottest tracks right now',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    songs: ['1', '2', '3', '7'],
    followers: 35000000,
    region: 'Global'
  },
  {
    id: 'p2',
    name: 'Chill Vibes',
    description: 'Relax and unwind with these mellow tracks',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    songs: ['5', '6', '3'],
    followers: 12000000,
    region: 'Global'
  },
  {
    id: 'p3',
    name: 'Workout Mix',
    description: 'Get pumped with high-energy beats',
    coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop',
    songs: ['1', '4', '7', '8'],
    followers: 8500000,
    region: 'North America'
  },
  {
    id: 'p4',
    name: 'Late Night Drives',
    description: 'Perfect soundtrack for night driving',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    songs: ['4', '6', '1'],
    followers: 6200000,
    region: 'Global'
  },
  {
    id: 'p5',
    name: 'European Hits',
    description: 'Top tracks from Europe',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    songs: ['5', '2', '3'],
    followers: 9100000,
    region: 'Europe'
  },
  {
    id: 'p6',
    name: 'Americas Chart',
    description: 'Popular in North & South America',
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    songs: ['4', '8', '7', '1'],
    followers: 11000000,
    region: 'North America'
  }
];

export const mockArtists = [
  {
    id: 'a1',
    name: 'The Weeknd',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    followers: 85000000,
    verified: true,
    topSongs: ['1', '4', '6']
  },
  {
    id: 'a2',
    name: 'Dua Lipa',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    followers: 72000000,
    verified: true,
    topSongs: ['3', '5']
  },
  {
    id: 'a3',
    name: 'Ed Sheeran',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    followers: 95000000,
    verified: true,
    topSongs: ['2']
  },
  {
    id: 'a4',
    name: 'Harry Styles',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
    followers: 68000000,
    verified: true,
    topSongs: ['7']
  }
];

export const mockRegions = [
  { id: 'global', name: 'Global', flag: '🌍' },
  { id: 'north-america', name: 'North America', flag: '🌎' },
  { id: 'europe', name: 'Europe', flag: '🇪🇺' },
  { id: 'asia', name: 'Asia', flag: '🌏' },
  { id: 'latin-america', name: 'Latin America', flag: '🌎' },
  { id: 'africa', name: 'Africa', flag: '🌍' }
];

export const mockLyrics = {
  '1': [
    { time: 0, text: 'I\'ve been tryna call' },
    { time: 3, text: 'I\'ve been on my own for long enough' },
    { time: 6, text: 'Maybe you can show me how to love, maybe' },
    { time: 12, text: 'I\'m going through withdrawals' },
    { time: 15, text: 'You don\'t even have to do too much' },
    { time: 18, text: 'You can turn me on with just a touch, baby' }
  ],
  '2': [
    { time: 0, text: 'The club isn\'t the best place to find a lover' },
    { time: 4, text: 'So the bar is where I go' },
    { time: 8, text: 'Me and my friends at the table doing shots' },
    { time: 12, text: 'Drinking fast and then we talk slow' }
  ]
};