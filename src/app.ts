import * as opentelemetry from "@opentelemetry/api";
import { logger } from "./logger";
import { open } from "fs";
import { functionWithNoOtelVisibility } from "./otherFile";

logger.info("foobara");

const tracer = opentelemetry.trace.getTracer("example-basic-tracer-node");

for (let i = 0; i < 1; i++) {
  const val = tracer.startActiveSpan("init", (span) => {
    logger.info(`expect trace_id to be in this log ${i}`);
    functionWithNoOtelVisibility();
    span.end();
    return false;
  });

  logger.info({ val }, "Result from span");
}
