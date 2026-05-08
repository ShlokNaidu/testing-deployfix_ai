import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HealthResponse, User, SessionConfig } from 'shared';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  const response: HealthResponse = { status: 'ok', lastUpdated: new Date().toISOString() };
  res.json(response);
});

app.get('/api/users', (req: Request, res: Response) => {
  const users: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
  ];
  res.json(users);
});

app.get('/api/session-config', (req: Request, res: Response) => {
  const config: SessionConfig = {
    ttlSeconds: 3600,
    refreshOnActivity: true,
  };
  res.json(config);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
