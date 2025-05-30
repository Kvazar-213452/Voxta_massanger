import express, { Express, Request, Response } from 'express';

const PORT: string | number = 3001;

interface ResponseData {
    status: string;
    message?: string;
    version?: string;
}

const app: Express = express();
app.use(express.json());

if (!process.env.VERSION) {
    throw new Error('Missing VERSION in environment variables.');
}

app.post('/add_user', async (req: Request, res: Response<ResponseData>) => {
    try {
        const data = req.body.data;

        res.json({ status: 'success', message: 'The text message was sent successfully!' });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
