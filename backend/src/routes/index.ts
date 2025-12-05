import { Router } from 'express';

import token from './token';
import user from './user';
import ai from './ai';
export const router = Router();
router.get('/', (_req, res) => {
  res.json({
    uptime: process.uptime(),
    online: true,
    message: "let's gooooo!!",
  });
});

router.use('/user', user);
router.use('/token', token);

router.use('/ai', ai);
export default router;
