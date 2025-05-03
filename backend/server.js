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

// --- OpenAI Client ---
// Consider using a more descriptive variable name if managing multiple clients later
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI client initialized.");

// --- Middleware ---
app.use(cors()); // Configure origins properly for production
app.use(express.json());

// --- API Endpoint ---
app.post('/api/generate-playlist', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text input is required and cannot be empty.' });
    }
    const inputText = text.trim(); // Use trimmed text
    console.log(`Backend received text: "${inputText}"`);

    try {
        console.log("Calling OpenAI API...");

        const systemPrompt = `You are an expert music curator and mood analysis AI. Your goal is to generate personalized song suggestions based on user input.
Follow these steps carefully:
1. Analyze the user's text to deeply understand their current feeling, considering nuance and intensity.
2. Identify the single DOMINANT mood. Choose ONLY ONE from this specific list: Happy, Sad, Calm, Energetic, Angry, Anxious, Reflective, Neutral. Capitalize the chosen mood name.
3. Curate a list of exactly 7 distinct, REAL, and reasonably well-known songs (provide the primary artist for each). The songs MUST strongly match the identified dominant mood in terms of vibe, tempo, energy, and common lyrical themes associated with that mood. Prefer songs that are likely available on major streaming platforms.
4. Strive for some VARIETY within the playlist (e.g., avoid multiple songs from the exact same artist if possible, mix sub-genres slightly if appropriate for the mood). Ensure all suggestions are actual, verifiable songs. DO NOT invent songs or artists.
5. Format your response STRICTLY as a single, valid JSON object. Do NOT include any introductory text, explanations, apologies, markdown formatting, or anything outside the JSON structure.

The JSON object MUST contain exactly two top-level keys:
- "mood": A string containing only the single identified dominant mood (e.g., "Happy", "Calm").
- "playlist": An array containing exactly 7 song objects. Each song object in the array MUST have exactly two non-empty string keys: "name" (the exact song title) and "artist" (the main artist's name).

Example of the REQUIRED JSON output format:
{"mood": "Reflective", "playlist": [{"name": "Hallelujah", "artist": "Leonard Cohen"}, {"name": "Yesterday", "artist": "The Beatles"}, {"name": "Mad World", "artist": "Gary Jules"}, {"name": "Hurt", "artist": "Johnny Cash"}, {"name": "Fix You", "artist": "Coldplay"}, {"name": "Sound of Silence", "artist": "Simon & Garfunkel"}, {"name": "Everybody Hurts", "artist": "R.E.M."}]}`;

        // --- OpenAI API Call ---
        const completion = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Good balance of cost and capability for JSON mode
            // model: "gpt-4-turbo-preview", // Potentially higher quality suggestions, more expensive
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: inputText }
            ],
            temperature: 0.65, // Slightly increased temperature for potentially more interesting suggestions
            max_tokens: 900,  // Generous token limit for the JSON output
            n: 1,
            // You could add `user: userId` here if you have user authentication,
            // which helps OpenAI monitor for misuse.
        });

        const jsonResponseString = completion.choices[0]?.message?.content;
        if (!jsonResponseString) {
            console.error("OpenAI returned an empty message content.");
            throw new Error("Received an empty response from AI analysis.");
        }
        console.log("Raw JSON response string received from OpenAI.");

        // --- JSON Parsing and Validation ---
        let parsedData;
        try {
            parsedData = JSON.parse(jsonResponseString);
            console.log("Successfully parsed JSON response.");
        } catch (parseError) {
            console.error("Failed to parse JSON response from OpenAI:", parseError);
            console.error("Invalid JSON string was:", jsonResponseString);
            // Give a more specific error if JSON parsing fails
            throw new Error("AI failed to return valid JSON data. Please try again.");
        }

        // Stricter Validation
        if (!parsedData || typeof parsedData.mood !== 'string' || !parsedData.mood.trim() || !Array.isArray(parsedData.playlist)) {
             console.error("Parsed JSON data structure is incorrect. Missing keys or wrong types:", parsedData);
            throw new Error("AI response has incorrect data structure.");
        }

        const analyzedMood = parsedData.mood.trim();
        const suggestedPlaylist = parsedData.playlist;

        // Validate playlist content more thoroughly
        if (suggestedPlaylist.length === 0) {
             console.warn("AI returned an empty playlist array.");
             // Decide how to handle: We'll proceed, but the frontend will show "No tracks".
        }

        const validTracks = suggestedPlaylist.filter(track =>
            track &&
            typeof track.name === 'string' && track.name.trim() &&
            typeof track.artist === 'string' && track.artist.trim()
        );

        if (validTracks.length !== suggestedPlaylist.length) {
            console.warn(`Some tracks in the AI response were invalid (missing name/artist or wrong type). Original count: ${suggestedPlaylist.length}, Valid count: ${validTracks.length}`);
            if (validTracks.length === 0) {
                console.error("No valid tracks found in the AI response playlist.");
                // Optionally, throw an error here if zero valid tracks is unacceptable
                // throw new Error("AI failed to provide any valid tracks in the playlist.");
            }
        }
        console.log(`Validated ${validTracks.length} tracks from AI suggestion.`);


        // --- Prepare Final Playlist with Thematic Placeholders ---
        const placeholderBaseUrl = 'https://picsum.photos/seed/';
        // Sanitize mood for URL seed (lowercase, replace spaces/slashes)
        const moodSeed = analyzedMood.toLowerCase().replace(/[\s/]+/g, '-');

        const finalPlaylist = validTracks.map((track, index) => ({
            name: track.name.trim(), // Ensure no leading/trailing spaces
            artist: track.artist.trim(),
            // Create a more unique seed including mood, track name, and index
            artworkUrl: `${placeholderBaseUrl}${moodSeed}-${encodeURIComponent(track.name.substring(0, 20))}-${index}/150/150`
        }));

        console.log(`Generated final playlist for mood "${analyzedMood}" with ${finalPlaylist.length} tracks.`);

        // --- Send Response ---
        res.status(200).json({ // Explicitly set 200 OK status
            mood: analyzedMood,
            playlist: finalPlaylist
        });

    } catch (error) {
         // Log the specific error that occurred
        console.error('Error processing /api/generate-playlist request:', error.message);

         // Handle potential OpenAI specific errors
         if (error instanceof OpenAI.APIError) {
              console.error(`OpenAI API Error Details: Status ${error.status}, Type ${error.type}, Code ${error.code}`);
               // Provide a slightly more user-friendly message for common issues
               let userMessage = `AI Service Error: ${error.message}`;
               if (error.status === 429) {
                   userMessage = "AI Service is busy or rate limits exceeded. Please try again shortly.";
               } else if (error.status === 401) {
                    userMessage = "AI Service authentication failed. Please check server configuration."; // Internal issue
               }
              res.status(error.status || 500).json({ error: userMessage });
         }
         // Handle errors thrown by our own logic (parsing, validation)
         else if (error instanceof Error && (error.message.includes("JSON") || error.message.includes("structure") || error.message.includes("valid tracks"))) {
            res.status(500).json({ error: error.message }); // Send back our specific validation/parsing error
         }
         // Handle generic errors
         else {
             res.status(500).json({ error: 'An unexpected server error occurred while generating the playlist.' });
         }
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log('Ready to generate playlist via /api/generate-playlist using OpenAI only.');
});