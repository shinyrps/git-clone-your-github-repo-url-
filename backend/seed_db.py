import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'shinyfy_db')]

async def seed_data():
    print("Seeding Shinyfy database...")
    
    # Check if data already exists
    existing_songs = await db.songs.count_documents({})
    if existing_songs > 0:
        print(f"Database already has {existing_songs} songs. Skipping seed.")
        return
    
    # Seed Songs
    songs = [
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Blinding Lights",
            "artist": "The Weeknd",
            "album": "After Hours",
            "duration": "3:20",
            "duration_seconds": 200,
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "youtube_id": "fHI8X4OXluQ",
            "genre": "Pop",
            "region": "Global",
            "plays": 3400000000,
            "release_year": 2020,
            "lyrics": [
                {"time": 0, "text": "I've been tryna call"},
                {"time": 3, "text": "I've been on my own for long enough"},
                {"time": 6, "text": "Maybe you can show me how to love, maybe"}
            ],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Shape of You",
            "artist": "Ed Sheeran",
            "album": "Divide",
            "duration": "3:53",
            "duration_seconds": 233,
            "cover_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
            "youtube_id": "JGwWNGJdvx8",
            "genre": "Pop",
            "region": "Global",
            "plays": 3200000000,
            "release_year": 2017,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Levitating",
            "artist": "Dua Lipa",
            "album": "Future Nostalgia",
            "duration": "3:23",
            "duration_seconds": 203,
            "cover_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
            "youtube_id": "TUVcZfQe-Kw",
            "genre": "Pop",
            "region": "Global",
            "plays": 1200000000,
            "release_year": 2020,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Starboy",
            "artist": "The Weeknd",
            "album": "Starboy",
            "duration": "3:50",
            "duration_seconds": 230,
            "cover_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
            "youtube_id": "34Na4j8AVgA",
            "genre": "R&B",
            "region": "North America",
            "plays": 2800000000,
            "release_year": 2016,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Don't Start Now",
            "artist": "Dua Lipa",
            "album": "Future Nostalgia",
            "duration": "3:03",
            "duration_seconds": 183,
            "cover_url": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
            "youtube_id": "oygrmJFKYZY",
            "genre": "Disco Pop",
            "region": "Europe",
            "plays": 1500000000,
            "release_year": 2019,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Save Your Tears",
            "artist": "The Weeknd",
            "album": "After Hours",
            "duration": "3:35",
            "duration_seconds": 215,
            "cover_url": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
            "youtube_id": "XXYlFuWEuKI",
            "genre": "Synth Pop",
            "region": "Global",
            "plays": 2100000000,
            "release_year": 2020,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "As It Was",
            "artist": "Harry Styles",
            "album": "Harry's House",
            "duration": "2:47",
            "duration_seconds": 167,
            "cover_url": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
            "youtube_id": "H5v3kku4y6Q",
            "genre": "Pop Rock",
            "region": "Global",
            "plays": 2500000000,
            "release_year": 2022,
            "lyrics": [],
            "source": "youtube"
        },
        {
            "song_id": f"song_{uuid.uuid4().hex[:12]}",
            "title": "Peaches",
            "artist": "Justin Bieber",
            "album": "Justice",
            "duration": "3:18",
            "duration_seconds": 198,
            "cover_url": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop",
            "youtube_id": "tQ0yjYUFKAE",
            "genre": "R&B",
            "region": "North America",
            "plays": 1800000000,
            "release_year": 2021,
            "lyrics": [],
            "source": "youtube"
        }
    ]
    
    await db.songs.insert_many(songs)
    print(f"✅ Inserted {len(songs)} songs")
    
    # Get song IDs for playlists
    song_ids = [s["song_id"] for s in songs]
    
    # Seed Playlists
    playlists = [
        {
            "playlist_id": f"playlist_{uuid.uuid4().hex[:12]}",
            "name": "Today's Top Hits",
            "description": "The hottest tracks right now",
            "cover_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
            "songs": song_ids[:4],
            "owner": "system",
            "followers": 35000000,
            "region": "Global",
            "is_public": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "playlist_id": f"playlist_{uuid.uuid4().hex[:12]}",
            "name": "Chill Vibes",
            "description": "Relax and unwind with these mellow tracks",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "songs": song_ids[2:5],
            "owner": "system",
            "followers": 12000000,
            "region": "Global",
            "is_public": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "playlist_id": f"playlist_{uuid.uuid4().hex[:12]}",
            "name": "Workout Mix",
            "description": "Get pumped with high-energy beats",
            "cover_url": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop",
            "songs": [song_ids[0], song_ids[3], song_ids[6], song_ids[7]],
            "owner": "system",
            "followers": 8500000,
            "region": "North America",
            "is_public": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    
    await db.playlists.insert_many(playlists)
    print(f"✅ Inserted {len(playlists)} playlists")
    
    # Seed Artists
    artists = [
        {
            "artist_id": f"artist_{uuid.uuid4().hex[:12]}",
            "name": "The Weeknd",
            "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            "followers": 85000000,
            "verified": True,
            "top_songs": [song_ids[0], song_ids[3], song_ids[5]],
            "bio": "Abel Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer.",
            "genres": ["R&B", "Pop", "Alternative R&B"]
        },
        {
            "artist_id": f"artist_{uuid.uuid4().hex[:12]}",
            "name": "Dua Lipa",
            "image_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
            "followers": 72000000,
            "verified": True,
            "top_songs": [song_ids[2], song_ids[4]],
            "bio": "Dua Lipa is an English singer and songwriter known for her distinctive disco-pop sound.",
            "genres": ["Pop", "Disco", "Dance-pop"]
        },
        {
            "artist_id": f"artist_{uuid.uuid4().hex[:12]}",
            "name": "Ed Sheeran",
            "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
            "followers": 95000000,
            "verified": True,
            "top_songs": [song_ids[1]],
            "bio": "Edward Christopher Sheeran is an English singer-songwriter, guitarist, record producer, and actor.",
            "genres": ["Pop", "Folk", "Acoustic"]
        }
    ]
    
    await db.artists.insert_many(artists)
    print(f"✅ Inserted {len(artists)} artists")
    
    print("\\n✅ Database seeding completed successfully!")
    print(f"\\n📊 Summary:")
    print(f"   - Songs: {len(songs)}")
    print(f"   - Playlists: {len(playlists)}")
    print(f"   - Artists: {len(artists)}")

if __name__ == "__main__":
    asyncio.run(seed_data())
