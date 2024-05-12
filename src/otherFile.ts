import { logger } from "./logger";

export const functionWithNoOtelVisibility = () => {
  logger.info("I'm in the other file");
  localFuncInOtherFile();
};

const localFuncInOtherFile = () => {
  logger.info("I'm in the other file, level 2 deep");
};
