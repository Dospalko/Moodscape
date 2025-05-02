// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.OPENAI_API_KEY) {
    console.error("FATAL ERROR: Missing OPENAI_API_KEY in .env file.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI client initialized.");

app.use(cors());
app.use(express.json());

app.post('/api/generate-playlist', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text input is required.' });
    }
    console.log(`Backend received text: "${text}"`);

    try {
        console.log("Calling OpenAI for mood analysis and playlist suggestion...");

        // --- **** START OF PROMPT MODIFICATION **** ---
        const systemPrompt = `You are an expert music curator and mood analysis AI. Your goal is to generate personalized song suggestions based on user input.
Follow these steps carefully:
1. Analyze the user's text to deeply understand their current feeling, considering nuance and intensity.
2. Identify the single DOMINANT mood. Choose ONLY ONE from this specific list: Happy, Sad, Calm, Energetic, Angry, Anxious, Reflective, Neutral. Capitalize the chosen mood name.
3. Curate a list of exactly 7 distinct, REAL, and reasonably well-known songs (provide the primary artist for each). The songs MUST strongly match the identified dominant mood in terms of vibe, tempo, energy, and common lyrical themes associated with that mood.
4. Strive for some VARIETY within the playlist (e.g., avoid multiple songs from the exact same artist if possible, mix sub-genres slightly if appropriate for the mood). Ensure all suggestions are actual, verifiable songs. DO NOT invent songs or artists.
5. Format your response STRICTLY as a single, valid JSON object. Do NOT include any introductory text, explanations, apologies, markdown formatting, or anything outside the JSON structure.

The JSON object MUST contain exactly two top-level keys:
- "mood": A string containing only the single identified dominant mood (e.g., "Happy", "Calm").
- "playlist": An array containing exactly 7 song objects. Each song object in the array MUST have exactly two string keys: "name" (the exact song title) and "artist" (the main artist's name).

Example of the REQUIRED JSON output format:
{"mood": "Reflective", "playlist": [{"name": "Hallelujah", "artist": "Leonard Cohen"}, {"name": "Yesterday", "artist": "The Beatles"}, {"name": "Mad World", "artist": "Gary Jules"}, {"name": "Hurt", "artist": "Johnny Cash"}, {"name": "Fix You", "artist": "Coldplay"}, {"name": "Sound of Silence", "artist": "Simon & Garfunkel"}, {"name": "Everybody Hurts", "artist": "R.E.M."}]}`;
        // --- **** END OF PROMPT MODIFICATION **** ---


        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Good model for JSON mode
            // model: "gpt-4-turbo-preview", // Potentially even better results
            response_format: { type: "json_object" }, // Request JSON output
            messages: [
                {
                    role: "system",
                    content: systemPrompt // Use the refined prompt
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.6, // Keep some creativity but focus on relevance
            max_tokens: 800,  // Slightly increased just in case of longer names
            n: 1,
        });

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
            console.error("Invalid JSON string received:", jsonResponseString);
            throw new Error("OpenAI returned invalid JSON format.");
        }

        if (!parsedData || typeof parsedData.mood !== 'string' || !Array.isArray(parsedData.playlist)) {
             console.error("Parsed JSON data is missing required keys or has incorrect types:", parsedData);
            throw new Error("OpenAI JSON response structure is incorrect.");
        }
         // Optional: Further validate the number of tracks and keys within track objects if needed
         if (parsedData.playlist.length !== 7 || parsedData.playlist.some(track => !track.name || !track.artist)) {
            console.warn("Parsed JSON playlist data might be incomplete or have incorrect length.");
            // Decide how to handle: throw error, try to fix, or proceed with caution?
            // For now, we proceed, but this indicates potential prompt/model issues.
         }


        const analyzedMood = parsedData.mood || 'Neutral';
        // Filter out potentially empty track objects just in case
        const suggestedPlaylist = parsedData.playlist.filter(track => track && track.name && track.artist);

        const placeholderBaseUrl = 'https://picsum.photos/seed/';
        const finalPlaylist = suggestedPlaylist.map((track, index) => ({
            name: track.name,
            artist: track.artist,
            artworkUrl: `${placeholderBaseUrl}${encodeURIComponent(track.name)}/${index + 1}/150/150` // Add index variation to seed
        }));

        console.log(`Generated playlist with ${finalPlaylist.length} tracks.`);

        res.json({
            mood: analyzedMood,
            playlist: finalPlaylist
        });

    } catch (error) {
        console.error('Error during OpenAI processing:', error.message);
         if (error instanceof OpenAI.APIError) {
              console.error(`OpenAI API Error Details: Status ${error.status}, Type ${error.type}, Code ${error.code}`);
              res.status(error.status || 500).json({ error: `OpenAI Service Error: ${error.message}` });
         } else {
             // Send back the specific error message thrown by our logic (e.g., parsing/validation errors)
             res.status(500).json({ error: error.message || 'Failed to generate playlist due to an internal error.' });
         }
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log('Ready to generate playlist via /api/generate-playlist using OpenAI only.');
});