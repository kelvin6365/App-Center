import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JSONBody = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const target = ctx.switchToHttp().getRequest().body[data];
    return target ? JSON.parse(target) : null;
  }
);
