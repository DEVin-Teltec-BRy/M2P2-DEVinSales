import morgan from "morgan";
import Logger from "./logger";

const stream = {
  write: (message) => Logger.http(message),
};

const morganmiddleware = morgan(
  ":method: url : status :res[content-length] - :response-time ms",
  { stream }
);

export default morganmiddleware;
