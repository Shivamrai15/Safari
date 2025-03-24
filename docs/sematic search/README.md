
# Semantic Search Service Documentation

This documentation covers the semantic search service of our application. It explains how the code integrates Qdrant for vector search and the Gemini API for generating text embeddings. The code is organized into multiple files, each serving a specific purpose. Below is a detailed breakdown of each file and its functions.

---

## File: `qdrant.ts`

This file sets up the connection to Qdrant, a vector database that handles semantic searches.

```typescript
import dotenv from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

export const qdarnt = new QdrantClient({
    url : process.env.QDRANT_URL,
    apiKey : process.env.QDRANT_SECRET
});
```

### Explanation
- **dotenv Import and Configuration:**  
  Loads environment variables from a `.env` file into `process.env` so that sensitive information (like the Qdrant URL and API key) is securely managed.
  
- **Qdrant Client Initialization:**  
  Creates an instance of `QdrantClient` using the URL and API key from the environment variables.  
  - `url`: Points to the Qdrant instance.
  - `apiKey`: Provides authentication for API calls.
  
- **Export:**  
  The initialized client (`qdarnt`) is exported for use in other parts of the application.

---

## File: `gemini.ts`

This file integrates with the Gemini API (from Google Generative AI) to generate text embeddings. These embeddings are used for semantic search operations.

```typescript
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

export const generateEmbeddings = async(text: string) => {
    const embedding = await model.embedContent(text);
    return Array.from(embedding.embedding.values);
}
```

### Explanation
- **dotenv Import and Configuration:**  
  Loads environment variables to securely access the Gemini API key.
  
- **GoogleGenerativeAI Initialization:**  
  Initializes a new instance of the Google Generative AI client using the provided API key.
  
- **Model Setup:**  
  Retrieves a specific embedding model named `"text-embedding-004"` to generate embeddings for the provided text.
  
- **`generateEmbeddings` Function:**  
  - Accepts a string (`text`) as input.
  - Calls the model's `embedContent` method to generate an embedding.
  - Converts the embedding data to a regular array and returns it.
  
- **Export:**  
  The function `generateEmbeddings` is exported for use in other modules.

---

## File: `collections.ts`

This file defines functions to create different collections in Qdrant for songs, artists, and albums. These collections store the vectors (embeddings) along with associated metadata.

```typescript
import { qdarnt } from "./qdarnt";

export const createSongCollection = async () => {
    try {
        const collection = await qdarnt.createCollection("song", {
            vectors: {
                size: 768,
                distance: "Cosine"
            }
        });
        console.log(collection);
    } catch (error) {
        console.log("COLLECTION ERROR", error);
    }
}

export const createArtistCollection = async () => {
    try {
        const collection = await qdarnt.createCollection("artist", {
            vectors: {
                size: 768,
                distance: "Cosine"
            }
        });
        console.log(collection);
    } catch (error) {
        console.log("COLLECTION ERROR", error);
    }
}

export const createAlbumCollection = async () => {
    try {
        const collection = await qdarnt.createCollection("album", {
            vectors: {
                size: 768,
                distance: "Cosine"
            }
        });
        console.log(collection);
    } catch (error) {
        console.log("COLLECTION ERROR", error);
    }
}
```

### Explanation
- **Import Qdrant Client:**  
  Uses the client (`qdarnt`) configured in `qdrant.ts` to interact with the Qdrant database.
  
- **Collection Creation Functions:**  
  - **`createSongCollection`**  
    Creates a collection named `"song"` with vector dimensions set to `768` and uses the `"Cosine"` distance metric.
  - **`createArtistCollection`**  
    Creates a collection named `"artist"` with similar vector configuration.
  - **`createAlbumCollection`**  
    Creates a collection named `"album"` with the same configuration.
  
- **Error Handling:**  
  Each function uses a try-catch block to log any errors during collection creation.
  
- **Export:**  
  The functions are exported to be called elsewhere when setting up the database.

---

## File: `db.ts`

This file initializes the Prisma Client to connect with the application's database.

```typescript
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
```

### Explanation
- **Prisma Client Import:**  
  Imports `PrismaClient` from the Prisma library.
  
- **Initialization and Export:**  
  Instantiates the Prisma Client and exports it as `db`. This client is used for database operations such as querying songs, artists, and albums.

---

## File: `seed.ts`

This file seeds the Qdrant collections with data from the database by generating embeddings and upserting them into Qdrant. It includes separate functions for songs, artists, and albums.

```typescript
import { db } from "./db";
import { generateEmbeddings } from "./gemini";
import { qdarnt } from "./qdarnt";
import { v4 as uuidv4 } from 'uuid';

export const seedSongs = async () => {
    try {
        const songs = await db.song.findMany();
        console.log("Processing Songs...");

        for (let song of songs) {
            console.log(`Processing Song: ${song.name}`);
            const vector = await generateEmbeddings(song.name.toLowerCase());
            const vectorSong = {
                id: uuidv4(),
                vector,
                payload: { 
                    id: song.id,
                    name: song.name,
                    artists: song.artistIds,
                    album: song.albumId
                }
            };
            await qdarnt.upsert("song", { points: [vectorSong] });
        }
        console.log("Seeding songs done");
    } catch (error) {
        console.log("Error seeding songs", error);
    }
}

export const seedArtists = async () => {
    try {
        const artists = await db.artist.findMany();
        console.log("Processing Artists...");

        for (let artist of artists) {
            console.log(`Processing Artist: ${artist.name}`);
            const vector = await generateEmbeddings(artist.name.toLowerCase());
            const vectorArtist = {
                id: uuidv4(),
                vector,
                payload: {
                    id: artist.id,
                    name: artist.name,
                    songs: artist.songIds,
                    image: artist.image
                }
            };
            await qdarnt.upsert("artist", { points: [vectorArtist] });
        }
        console.log("Artists seeded successfully");
    } catch (error) {
        console.log("Error seeding artists", error);
    }
}

export const seedAlbums = async () => {
    try {
        const albums = await db.album.findMany({
            include: { songs: true },
        });
        console.log("Processing Albums...");

        for (const album of albums) {
            console.log(`Processing Album: ${album.name}`);
            const vector = await generateEmbeddings(album.name.toLowerCase());
            const vectorAlbum = {
                id: uuidv4(),
                vector,
                payload: {
                    id: album.id,
                    name: album.name,
                    songs: album.songs.map(song => song.id),
                    release: album.release,
                    image: album.image,
                    color: album.color
                }
            };
            await qdarnt.upsert("album", { points: [vectorAlbum] });
        }
        console.log("Albums seeded successfully");
    } catch (error) {
        console.error("Error seeding albums:", error);
    }
};
```

### Explanation
- **Imports:**
  - **Database Client (`db`):** For fetching songs, artists, and albums from the database.
  - **`generateEmbeddings`:** To obtain vector representations of text.
  - **Qdrant Client (`qdarnt`):** For upserting (inserting or updating) vector data.
  - **`uuidv4`:** For generating unique IDs for each vector point.
  
- **`seedSongs` Function:**
  - Fetches all songs from the database.
  - For each song, it generates an embedding based on the song name.
  - Constructs a vector object containing the embedding and associated metadata (ID, name, artists, album).
  - Upserts the vector object into the `"song"` collection in Qdrant.
  
- **`seedArtists` Function:**
  - Fetches all artists from the database.
  - Generates an embedding using the artist's name.
  - Creates a vector object with metadata (ID, name, songs, image).
  - Upserts the vector into the `"artist"` collection.
  
- **`seedAlbums` Function:**
  - Retrieves all albums, including their associated songs.
  - Generates an embedding for each album based on its name.
  - Constructs a vector object with detailed metadata including song IDs, release date, image, and color.
  - Upserts the vector into the `"album"` collection.
  
- **Error Handling:**  
  Each seeding function is wrapped in a try-catch block to log errors and ensure smooth operation during the seeding process.
