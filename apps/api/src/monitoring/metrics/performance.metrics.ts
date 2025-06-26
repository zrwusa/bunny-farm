import { Histogram } from 'prom-client';

// NestJS dependency injection is token-based.
// The third-party library itself is not the @Injectable() service of NestJS, and Nest cannot automatically infer the injection method.
// So you have to register with provide: 'token' + useValue or useFactory.
// After registration, you must also export (exports: [...]), otherwise other modules will not be able to access it.

// If you want to inject a third-party instance of MonitoringModule into AppModule, you must register and export the provider with @Inject('token').
// Otherwise, Nest doesn't know how to construct it, and you can't find the dependency

// NestJS forces you to clearly define module boundaries and dependencies.
// Prevent "implicit dependencies" or "scramble instances across modules",
// Ensure that the dependency injection container can correctly find all required instances.

// “I have these instances myself”
// → providers
// Examples of services, interceptors, factories, etc. created or declared by the module itself are written in @Module({ providers: [...] }).
//
// "I need to take these instances from other modules"
// → Imports
// When you need to rely on instances exported by other modules, put those modules into @Module({ imports: [...] }), and Nest will help you inject the exported providers.
//
// "I'm willing to use these instances outside"
// → exports
// Expose the examples in your providers to other modules, and write them in @Module({ exports: [...] }). In this way, others can use the provider you exported after importing your module.
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
