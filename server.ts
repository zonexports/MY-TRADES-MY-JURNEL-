import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  // AI Trade Coach / Mentor Endpoint
  app.post('/api/ai-mentor', async (req, res) => {
    try {
      const { trades, profile } = req.body;

      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in secrets.' });
      }

      const totalTrades = trades.length;
      const wins = trades.filter((t: any) => t.result === 'Win').length;
      const losses = trades.filter((t: any) => t.result === 'Loss').length;
      const totalPnL = trades.reduce((acc: number, t: any) => acc + (Number(t.pnl) || 0), 0);
      const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;

      const prompt = `You are an elite institutional Forex & Gold (XAUUSD) trading mentor and Smart Money Concepts (SMC) master coach. Analyze the following trader profile and trade journal statistics for "${profile.name || 'FXZAIDU Trader'}" (${profile.tags?.join(', ') || 'Forex & Gold Trader'}):

Statistics:
- Total Trades: ${totalTrades}
- Win Rate: ${winRate}% (${wins} Wins, ${losses} Losses)
- Net Total P&L: $${totalPnL.toFixed(2)}

Recent Trades Data:
${JSON.stringify(trades.slice(0, 20), null, 2)}

Provide a professional, sharp, encouraging yet rigorous coaching report in markdown format. Include:
1. Performance & Win-Rate Diagnosis (strengths and weaknesses)
2. Risk Management & SMC Strategy Feedback (Order blocks, liquidity sweeps, risk-to-reward)
3. Psychological Advice & Actionable Tips to improve next week's trading
4. A motivational trader quote customized for this performance.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('AI Mentor Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI mentoring analysis.' });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FXZAIDU Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
