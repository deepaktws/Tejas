// src/routes.ts
import { Router, Request, Response } from 'express';

const apiRouter = Router();

// Health check endpoint for monitoring systems and uptime checks
apiRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString() 
  });
});

export default apiRouter;
