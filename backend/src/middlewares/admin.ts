import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

export default isAdmin;
