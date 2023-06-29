/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetricsLogger } from 'aws-embedded-metrics';

// @ts-expect-error No, we did not mean to extend... we mean to fake the interface
export class MetricsLoggerDummy implements MetricsLogger {
  /**
   * Implements the MetricsLogger interface with everything being a no-op
   */
  constructor() {
    // hi!
  }

  /** @inheritdoc */
  public async flush(): Promise<void> {
    // hi!
  }
  /** @inheritdoc */
  public setProperty(key: string, value: unknown): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public putDimensions(dimensions: Record<string, string>): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setDimensions(...setDimensions: Record<string, string>[]): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public putMetric(key: string, value: number, unit?: string): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setNamespace(value: string): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setTimestamp(timestamp: number | Date): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public new(): MetricsLogger {
    // hi!
    return this as unknown as MetricsLogger;
  }
}
