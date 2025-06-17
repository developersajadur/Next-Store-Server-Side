import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
const app = express();

// parsers
// app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://next-store-pro.vercel.app/'],
    credentials: true,
  }),
);

// Routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Next Store Server Is Running',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
