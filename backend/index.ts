import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import clientRouter from "./routers/clientRouter"
import freelancerRouter from "./routers/freelancerRouter"
import commonRouter from "./routers/commonRouter"
import adminRouter from "./routers/adminRouter"
import cors from "cors"
import cookieParser from "cookie-parser"
import uploadToS3 from './routers/uploadToS3';
import { authMiddleware } from './middlewares/middleware';

const app = express();
dotenv.config()
const port =  process.env.PORT || 3000;

app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/client", clientRouter)
app.use("/api/freelancer", freelancerRouter)
// app.use("/api/upload", uploadToS3)  // Uncomment this. Commented this to improve development time
app.use("/api/common", commonRouter)
app.use("/api/admin", adminRouter)

app.post('/hello', authMiddleware,(req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});