const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors'); // Import CORS package
const app = express();
const port = 4000; // or any other port you prefer
const genAI = new GoogleGenerativeAI(process.env.API_KEY||"AIzaSyDJ2dQG-xcmgpyK5sllExVVGBnuM_FdUDw");

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


// Endpoint to receive speech recognition results
app.post('/api/recognize', async(req, res) => {
    const { transcript } = req.body;
    const generationConfig = {
        maxOutputTokens: 250,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig});

    const result = await model.generateContent(transcript);
    const response = await result.response;
    const text = response.text();
    // Process the received transcript here (e.g., log it to console)

    // Optionally, you can send a response back to the client
    res.status(200).json({ message: text });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
