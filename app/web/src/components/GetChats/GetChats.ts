import { Request, Response } from 'express';
import axios from 'axios';

export async function GetChats(req: Request, res: Response) {
  try {
    const data = req.body.data;

    const response = await axios.post(`http://localhost:${process.env.CHAT_SERVICE}/get_chats`, {
      data: [req.session.id]
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.json({ status: 2 });
  }
}