import { createParamDecorator, ExecutionContext } from '@nestjs/common';

function getRequest(context: ExecutionContext) {
  return context.switchToHttp().getRequest();
}

export const GetUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): number => getRequest(context).user?.id,
);

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): any => getRequest(context).user,
);
