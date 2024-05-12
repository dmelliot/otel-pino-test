import * as opentelemetry from "@opentelemetry/api";
import { logger } from "./logger";
import { open } from "fs";
import { functionWithNoOtelVisibility } from "./otherFile";

const deepFunction1 = () => {
  logger.info("logging from a deeper function");
  deepFunction2();
};

const deepFunction2 = () => {
  logger.info("logging from two levels deep");
};

logger.info("foobara");

const tracer = opentelemetry.trace.getTracer("example-basic-tracer-node");

const s = tracer.startSpan("my space");
s.setAttribute("criterion", "sdfsdsdfsdf");

logger.info(`maybe here?`);
for (let i = 0; i < 1; i++) {
  const val = tracer.startActiveSpan("init", (span) => {
    span.setAttribute("criterion", "mu-criterion-urn");
    logger.info(`expect trace_id to be in this log ${i}`);
    deepFunction1();
    functionWithNoOtelVisibility();
    span.end();
    return false;
  });

  logger.info({ val }, "Result from span");
}
