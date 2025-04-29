// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001; // Backend pobeží na porte 3001

// --- OpenAI Configuration ---
if (!process.env.OPENAI_API_KEY) {
    console.error("FATAL ERROR: OPENAI_API_KEY is missing in the .env file.");
    process.exit(1);
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI client initialized.");

// --- Middleware ---
// Povoľ požiadavky z akéhokoľvek pôvodu (pre vývoj). Pre produkciu nastav presnú doménu frontendu.
app.use(cors());
app.use(express.json()); // Umožní spracovať JSON v tele požiadavky

// --- API Endpoint ---
app.post('/api/analyze-mood', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text input is required.' });
    }

    console.log(`Backend received text: "${text}"`);

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a mood analysis expert. Analyze the user's text and classify the dominant mood into ONE of these categories: Happy, Sad, Calm, Energetic, Angry, Anxious, Reflective, Neutral. Respond with ONLY the category name, capitalized."
                },
                { role: "user", content: text }
            ],
            temperature: 0.4,
            max_tokens: 15,
            n: 1,
        });

        let analyzedMood = completion.choices[0]?.message?.content?.trim() || 'Neutral';

        const allowedMoods = ['Happy', 'Sad', 'Calm', 'Energetic', 'Angry', 'Anxious', 'Reflective', 'Neutral'];
        if (!allowedMoods.includes(analyzedMood)) {
            console.warn(`OpenAI returned unexpected mood: "${analyzedMood}". Defaulting to Neutral.`);
            analyzedMood = 'Neutral';
        }

        console.log(`Backend analyzed mood: "${analyzedMood}"`);
        res.json({ mood: analyzedMood });

    } catch (error) {
        console.error('Error calling OpenAI API:');
        if (error instanceof OpenAI.APIError) {
            console.error(`Status: ${error.status}, Message: ${error.message}`);
            res.status(error.status || 500).json({ error: `OpenAI API Error: ${error.message}` });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log('Ready to analyze mood via /api/analyze-mood');
});