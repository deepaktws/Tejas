// src/server.ts
import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRouter from './router'; // Import your endpoints

const app = express();
const PORT = config.PORT;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Attach Endpoints (We prefix them with /api)
app.use('/api/v1', apiRouter); 

// 3. Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
