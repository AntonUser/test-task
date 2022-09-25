import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPayload } from 'src/common/interfaces/payload.interface';

export const Payload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
