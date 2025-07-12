// apps/api/src/core/cookie.module.ts

import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';

@Module({
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
