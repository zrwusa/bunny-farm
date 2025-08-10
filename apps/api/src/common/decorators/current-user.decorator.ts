import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CurrentJwtUser } from '../../auth/types/types';

export const CurrentUser = createParamDecorator(
  (property: keyof CurrentJwtUser | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    return property ? user?.[property] : user;
  },
);
