import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: 'Resource already exists',
        });
      case 'P2025':
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Resource not found',
        });
      case 'P2003':
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Related resource not found',
        });
      default:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          message: 'Internal server error',
        });
    }
  }
}
