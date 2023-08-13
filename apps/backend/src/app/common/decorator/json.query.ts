import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JSONQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const target = ctx.switchToHttp().getRequest().query[data];
    return target ? JSON.parse(target) : null;
  }
);
