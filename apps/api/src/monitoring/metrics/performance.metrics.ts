import { Histogram } from 'prom-client';

export const PerformanceMetrics = [
  {
    provide: 'http_request_duration_seconds',
    useValue: new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'handler'],
      buckets: [0.1, 0.5, 1, 2, 5], // example buckets
    }),
  },
];
