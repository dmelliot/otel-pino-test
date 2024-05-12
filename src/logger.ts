import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new PinoInstrumentation({
      // Optional hook to insert additional context to log object.
      logHook: (span, record, level) => {
        record["resource.service.name"] =
          provider.resource.attributes["service.name"];
        record["extra_hook"] = "value here";
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
export const logger = pino();
