import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Histogram } from 'prom-client';
import { Observable, tap } from 'rxjs';
import { NestContext } from '../../types/nest';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(
    @Inject('http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const contextType = context.getType() as NestContext;

    const handler = context.getHandler()?.name || 'unknown';

    const request =
      contextType === 'http'
        ? context.switchToHttp().getRequest()
        : contextType === 'graphql'
          ? context.getArgByIndex(2)?.req // for GQL
          : null;

    const route = contextType === 'http' ? (request?.route?.path ?? 'unknown') : 'graphql';

    const method = contextType === 'http' ? (request?.method ?? 'UNKNOWN') : 'GQL';

    return next.handle().pipe(
      tap(() => {
        const elapsed = (Date.now() - now) / 1000; // seconds
        this.histogram.observe({ route, method, handler }, elapsed);
      }),
    );
  }
}
