// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Axios už nepotrebujeme pre tento prístup
// const axios = require('axios');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Kontrola Environment Premenných ---
if (!process.env.OPENAI_API_KEY) {
    console.error("FATAL ERROR: Missing OPENAI_API_KEY in .env file.");
    process.exit(1);
}

// --- OpenAI Klient ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI client initialized.");

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Endpoint (Stále /api/generate-playlist) ---
app.post('/api/generate-playlist', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text input is required.' });
    }
    console.log(`Backend received text: "${text}"`);

    try {
        // --- JEDNO VOLANIE OpenAI pre náladu aj playlist ---
        console.log("Calling OpenAI for mood analysis and playlist suggestion...");
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Modely končiace na 1106 a novšie podporujú JSON mód lepšie
            // model: "gpt-4-turbo-preview", // Ešte lepší pre JSON mód
            response_format: { type: "json_object" }, // Požadujeme JSON výstup!
            messages: [
                {
                    role: "system",
                    // Dôkladný prompt pre požadovaný JSON výstup
                    content: `Analyze the user's mood from the provided text. Identify the dominant mood (one of: Happy, Sad, Calm, Energetic, Angry, Anxious, Reflective, Neutral). Then, suggest a list of 7 real songs (with artists) that fit this mood. Respond ONLY with a valid JSON object containing two keys: "mood" (string with the detected mood, capitalized) and "playlist" (an array of objects, where each object has "name" and "artist" string keys). Example format: {"mood": "Happy", "playlist": [{"name": "Good Vibrations", "artist": "The Beach Boys"}, {"name": "Walking on Sunshine", "artist": "Katrina & The Waves"}, ...]}`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.6, // Mierne kreatívny, ale stále sa snaží držať reality
            max_tokens: 700, // Dostatočný priestor pre JSON s playlistom
            n: 1,
        });

        // Získanie a parsovanie JSON odpovede
        const jsonResponseString = completion.choices[0]?.message?.content;
        if (!jsonResponseString) {
            throw new Error("OpenAI returned an empty response.");
        }

        console.log("Raw JSON response from OpenAI:", jsonResponseString);

        let parsedData;
        try {
            parsedData = JSON.parse(jsonResponseString);
        } catch (parseError) {
            console.error("Failed to parse JSON response from OpenAI:", parseError);
            console.error("Invalid JSON string:", jsonResponseString);
            throw new Error("OpenAI returned invalid JSON format.");
        }

        // Validácia štruktúry
        if (!parsedData || typeof parsedData.mood !== 'string' || !Array.isArray(parsedData.playlist)) {
             console.error("Parsed JSON data is missing required keys or has incorrect types:", parsedData);
            throw new Error("OpenAI JSON response is missing 'mood' or 'playlist' data.");
        }

        const analyzedMood = parsedData.mood || 'Neutral'; // Použi náladu z JSONu
        const suggestedPlaylist = parsedData.playlist;

        // --- Pridanie ZÁSTUPNÝCH obrázkov ---
        // OpenAI nevie vrátiť obrázky, tak použijeme Picsum pre variabilitu
        const placeholderBaseUrl = 'https://picsum.photos/seed/';
        const finalPlaylist = suggestedPlaylist.map((track, index) => ({
            name: track.name || "Unknown Track",
            artist: track.artist || "Unknown Artist",
            // Vytvoríme unikátny seed pre každý track, aby obrázky boli rôzne
            artworkUrl: `${placeholderBaseUrl}${encodeURIComponent(track.name || `track${index}`)}/150/150`
        }));

        console.log(`Generated playlist with ${finalPlaylist.length} tracks (using OpenAI suggestions).`);

        // Vráť náladu a vygenerovaný playlist (s placeholder obrázkami)
        res.json({
            mood: analyzedMood,
            playlist: finalPlaylist
        });

    } catch (error) {
        console.error('Error during OpenAI processing:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
         if (error instanceof OpenAI.APIError) {
              res.status(error.status || 500).json({ error: `OpenAI API Error: ${error.message}` });
         } else {
             res.status(500).json({ error: `Failed to generate playlist. ${error.message || ''}`.trim() });
         }
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log('Ready to generate playlist via /api/generate-playlist using OpenAI only.');
});