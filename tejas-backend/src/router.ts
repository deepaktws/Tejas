// src/routes.ts
import { Router, Request, Response } from 'express';
import UploadRouter from './modules/upload/upload.router';
import ModelRouter from './modules/model/model.router';
import { API_ROUTES, MODEL_ROUTES, UPLOAD_ROUTES } from './constants/route';

const apiRouter = Router();

// Health check endpoint for monitoring systems and uptime checks
apiRouter.get(API_ROUTES.HEALTH, (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString() 
  });
});

apiRouter.use(UPLOAD_ROUTES.ROOT, UploadRouter)
apiRouter.use(MODEL_ROUTES.ROOT, ModelRouter)

export default apiRouter;
