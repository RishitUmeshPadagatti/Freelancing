import express from "express"
import { Request, Response } from "express"
import multer from 'multer';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ResponseStatus } from "../utils/values";

const uploadToS3 = express.Router()

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({
    storage: multer.memoryStorage(), // Store the file in memory before uploading
});

uploadToS3.post("/image", upload.single('profilePic'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(ResponseStatus.notFound).json({ msg: 'No file uploaded', success: false });
        }

        const file = req.file;
        const fileExtension = file.originalname.split('.').pop();

        if (!fileExtension) {
            return res.status(ResponseStatus.notFound).json({ msg: 'File extension is missing', success: false });
        }

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `profile-pictures/${uuidv4()}.${fileExtension}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(s3Params).promise();

        return res.status(ResponseStatus.success).json({ url: uploadResult.Location });
    } catch (error) {
        console.error('Error uploading file: ', error); // Log the error for debugging
        return res.status(ResponseStatus.internalServerError).json({ error: 'Error uploading file' });
    }
})

uploadToS3.post("/pdf", upload.single('resume'), async (req: Request, res: Response) => {
    try {
        if (!req.file){
            return res.status(ResponseStatus.notFound).json({msg: "No file uploaded", success: false})
        }

        const file = req.file;
        const fileExtension = file.originalname.split('.').pop()

        if (!fileExtension || fileExtension.toLowerCase() !== 'pdf'){
            return res.status(ResponseStatus.notFound).json({msg: "Only PDF files are allowed", success: false})
        }

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `resumes/${uuidv4()}.pdf`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(s3Params).promise();

        return res.status(ResponseStatus.success).json({url: uploadResult.Location, msg: "PDF uploaded successfully"})        
    } catch (error) {
        console.error('Error uploading file: ', error)
        return res.status(ResponseStatus.internalServerError).json({ error: 'Error uploading file' })
    }
})

export default uploadToS3