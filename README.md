# Flux Agency | AI Video Generator

A professional video prompt and asset generator tailored for Flux Agency. Optimized for **Nano Banana Pro (Gemini 3 Pro)** and **Veo 3.0**.

## Quick Start (Local)

1. **Set up API Key**: Add your Google API key to the `.env` file.
   ```env
   GOOGLE_API_KEY=your_key_here
   ```
2. **Run Locally**:
   ```bash
   node dev-server.mjs
   ```
3. **Access**: Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```
2. **Deploy**:
   ```bash
   vercel --prod
   ```
3. **Configure Environment**: Add `GOOGLE_API_KEY` in your Vercel project settings.

## Project Structure

- `/api/gemini.js` - Serverless proxy for Google Gemini API.
- `/public/index.html` - Main application UI and logic.
- `/dev-server.mjs` - Zero-dependency local development server.
- `vercel.json` - Vercel configuration for serverless functions.

## Privacy & Security

- No data is stored permanently. All prompts and generated assets are ephemeral and lost on page refresh.
- API traffic is proxied via serverless functions to ensure key security.
