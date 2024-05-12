import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
//import pino = require("pino");
import * as opentelemetry from "@opentelemetry/api";
//import * as pino from "pino";

// console.log("Hello World!!!");

// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new PinoInstrumentation({
      // Optional hook to insert additional context to log object.
      logHook: (span, record, level) => {
        record["resource.service.name"] =
          provider.resource.attributes["service.name"];
      },
      // Log span context under custom keys
      // This is optional, and will default to "trace_id", "span_id" and "trace_flags" as the keys
      logKeys: {
        traceId: "traceId",
        spanId: "spanId",
        traceFlags: "traceFlags",
      },
    }),
    // other instrumentations
  ],
});

import pino from "pino";
//const logger = (pino as any)();
const logger = pino();

//const logger = pino();
logger.info("foobara");

const tracer = opentelemetry.trace.getTracer("example-basic-tracer-node");

logger.info(`maybe here?`);
for (let i = 0; i < 3; i++) {
  tracer.startActiveSpan("init", (span) => {
    logger.info(`expect trace_id to be in this log ${i}`);
    span.end();
  });
}
// {"msg":"foobar","trace_id":"fc30029f30df383a4090d3189fe0ffdf","span_id":"625fa861d19d1056","trace_flags":"01", ...}
