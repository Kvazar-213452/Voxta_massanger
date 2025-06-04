import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.render('index');
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login/login');
});

router.get('/register', (req: Request, res: Response) => {
  res.render('login/register');
});

router.get('/register_end', (req: Request, res: Response) => {
  res.render('login/register_end');
});

export default router;
