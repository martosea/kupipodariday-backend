import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter<BadRequestException> {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: any = exception.getResponse();

    response.status(exception.getStatus()).json({
      message: 'Ошибка валидации',
      status: exception.getStatus(),
      errors: errorResponse,
    });
  }
}
