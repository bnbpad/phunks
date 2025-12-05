import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, InternalServerError } from '../errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode =
    err instanceof BadRequestError
      ? 400
      : err instanceof NotAuthorizedError
        ? 401
        : err instanceof NotFoundError
          ? 404
          : err instanceof InternalServerError
            ? 500
            : 500;

  if (statusCode === 500) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: err.message,
    details: 'details' in err ? (err as any).details : undefined,
  });
};
