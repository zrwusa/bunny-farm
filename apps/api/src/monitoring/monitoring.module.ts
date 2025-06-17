import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { PerformanceMetrics } from './metrics/performance.metrics';

@Module({
  imports: [PrometheusModule.register()],
  providers: [PerformanceInterceptor, ...PerformanceMetrics],
  exports: [PerformanceInterceptor, ...PerformanceMetrics],
})
export class MonitoringModule {}
