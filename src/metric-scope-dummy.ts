//
// Imported from: https://github.com/awslabs/aws-embedded-metrics-node/blob/master/src/logger/MetricScope.ts
// 2021-09-22 - HH - SRENG-1202
//
import { MetricsLogger } from 'aws-embedded-metrics';
import { MetricsLoggerDummy } from './metrics-logger-dummy';

/**
 * An asynchronous wrapper that provides a dummy metrics logger.
 */
export const metricScopeDummy = <T, U extends readonly unknown[]>(
  handler: (m: MetricsLogger) => (...args: U) => T | Promise<T>,
): ((...args: U) => Promise<T>) => {
  const wrappedHandler = async (...args: U): Promise<T> => {
    const metrics = new MetricsLoggerDummy() as unknown as MetricsLogger;
    return handler(metrics)(...args);
  };
  return wrappedHandler;
};
