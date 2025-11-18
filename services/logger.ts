import pino from "pino";

type LogLevel_T = "info" | "warn" | "error" | "fatal";

type LoggerOptions_T = {
  level?: LogLevel_T;
  enabled?: boolean;
  redact?: string[];
};

const defaultOptions: LoggerOptions_T = {
  level: "info",
  enabled: true,
};

const isServer = typeof window === "undefined";

const logger = isServer
  ? pino({
      level: defaultOptions.level,
      enabled: defaultOptions.enabled,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      },
    })
  : {
      info: console.log,
      warn: console.warn,
      error: console.error,
      fatal: console.error,
    };

const createContextualLogger = (context?: Record<string, any>) => {
  if (!isServer) return logger;

  // @ts-expect-error - IDk what's going on here
  return context ? logger.child(context) : logger;
};

const info = (message: string, data?: Record<string, any>) => logger.info(data || {}, message);

const warn = (message: string, data?: Record<string, any>) => logger.warn(data || {}, message);

const error = (message: string, error?: Error, data?: Record<string, any>) => {
  const errorData = error
    ? {
        error: {
          message: error.message,
          stack: error.stack,
          ...data,
        },
      }
    : data;

  logger.error(errorData || {}, message);
};
const fatal = (message: string, error?: Error, data?: Record<string, any>) => {
  const errorData = error
    ? {
        error: {
          message: error.message,
          stack: error.stack,
          ...data,
        },
      }
    : data;

  logger.fatal(errorData || {}, message);
};

export const log = {
  info,
  warn,
  error,
  fatal,
};

export const withContext = createContextualLogger;

export default logger;
