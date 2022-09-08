import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const whitelistValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(
      errors
        .map((error) => error.constraints.whitelistValidation)
        .join(' and '),
    ),
});
