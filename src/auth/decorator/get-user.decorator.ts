import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const GetUser = createParamDecorator(
  (params: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (params) {
      return request.user[params];
    }
    return request.user;
  },
);

export { GetUser };
