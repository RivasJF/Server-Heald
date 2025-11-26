import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.name === 'PrismaClientValidationError') {
      const status = HttpStatus.BAD_REQUEST;
      return response.status(status).json({
        statusCode: status,
        message: 'La solicitud es inválida. Por favor, verifique los datos enviados.',
        error: 'Bad Request'
      });
    }

    if (exception?.code === 'P2002') {
      const target = (exception.meta?.target as string[])?.join(', ') ?? 'campo(s) único(s)';
      const status = HttpStatus.CONFLICT;
      return response.status(status).json({
        message: `Ya existe un recurso con el ${target} proporcionado.`,
        error: 'Conflict',
        statusCode: status
      });
    }

    if (exception?.code === 'P2025') {
      const notFoundStatus = HttpStatus.NOT_FOUND;
      return response.status(notFoundStatus).json({
        message: `El recurso solicitado no fue encontrado.`,
        error: 'Not Found',
        statusCode: notFoundStatus
      });
    }

    // No es un error Prisma conocido -> delegar al manejador por defecto
    super.catch(exception, host);
  }
}