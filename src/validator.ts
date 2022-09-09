import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const whitelistValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: whitelistErrors,
});

function whitelistErrors(errors: ValidationError[]) {
  const collatedErrors = [];
  errors.forEach((error) =>
    collatedErrors.push(...Object.values(error.constraints)),
  );

  const errorString = collatedErrors.join(' and ');

  return new BadRequestException(errorString);
}
