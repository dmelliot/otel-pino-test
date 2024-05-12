
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new PinoInstrumentation({
      // Optional hook to insert additional context to log object.
      logHook: (span, record, level) => {
        record['resource.service.name'] =
          provider.resource.attributes['service.name'];
      },
      // Log span context under custom keys
      // This is optional, and will default to "trace_id", "span_id" and "trace_flags" as the keys
      logKeys: {
        traceId: 'traceId',
        spanId: 'spanId',
        traceFlags: 'traceFlags',
      },
    }),
    // other instrumentations
  ],
});

const pino = require('pino');
const logger = pino();
logger.info('foobar');
// {"msg":"foobar","trace_id":"fc30029f30df383a4090d3189fe0ffdf","span_id":"625fa861d19d1056","trace_flags":"01", ...}
