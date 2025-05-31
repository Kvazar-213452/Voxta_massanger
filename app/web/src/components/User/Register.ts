import { Request, Response } from 'express';
import axios from 'axios';
import { generate_code } from './func';

export async function register_start(req: Request, res: Response) {
  try {
    const data = req.body.data;
    let name: string = data[0];
    let pasw: string = data[1];
    let gmail: string = data[2];
    let code: string = generate_code();

    req.session.name = name;
    req.session.pasw = pasw;
    req.session.gmail = gmail;
    req.session.code = code;

    const response = await axios.post(`http://localhost:${process.env.NOTIFICATION_SERVICE}/send_gmail`, {
      data: [gmail, code]
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.json({ status: 2 });
  }
}

export async function register_end(req: Request, res: Response) {
  try {
    const data = req.body.data;
    let code: string = data[0];

    const now = new Date();
    const localDateTime = now.toLocaleString();

    if (req.session.code == code) {
      const response = await axios.post<{ status: number, id: string }>(
        `http://localhost:${process.env.USER_SERVICE}/add_user`, 
        { data: [req.session.name, req.session.gmail, req.session.gmail, localDateTime]});

        req.session.id = response.data.id;
        req.session.id = response.data.id;
        req.session.id = response.data.id;
        req.session.id = response.data.id;

      if (response.data.status === 1) {
        req.session.login = 1;
        res.json(response.data);
      } else {
        res.json(response.data);
      }
    } else {
      res.send(0);
    }
  } catch (error) {
    console.error(error);
    res.json({ status: 2 });
  }
}
