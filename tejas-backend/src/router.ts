// src/routes.ts
import { Router, Request, Response } from 'express';
import GradeSpecRouter from './modules/grade_spec/gradespec.router';

const apiRouter = Router();

// Health check endpoint for monitoring systems and uptime checks
apiRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString() 
  });
});

apiRouter.use('/heat', GradeSpecRouter)
export default apiRouter;
