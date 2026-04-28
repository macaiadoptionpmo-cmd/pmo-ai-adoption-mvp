import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'PMO AI Adoption Platform backend is running',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (placeholder - integrate with Supabase Auth)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Integrate with Supabase Auth
    res.status(201).json({ 
      message: 'Signup endpoint ready',
      email 
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Integrate with Supabase Auth
    res.status(200).json({ 
      message: 'Login endpoint ready',
      email 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({ message: 'Get current user endpoint ready' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 PMO AI Adoption Platform backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
