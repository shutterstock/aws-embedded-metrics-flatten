import { MetricsLogger } from 'aws-embedded-metrics';

// @ts-expect-error No, we did not mean to extend... we mean to fake the interface
export class OptionalMetricsLogger implements MetricsLogger {
  private _original: MetricsLogger;
  private _enabled: boolean;

  /**
   * Wraps a MetricsLogger to allow disabling metrics at runtime, such as when
   * running unit tests.
   * @param original - MetricsLogger that does not allow enabling/disabling metrics
   * @param enabled - Capture and emit metrics, or no-op everything
   */
  constructor(original: MetricsLogger, enabled: boolean) {
    this._original = original;
    this._enabled = enabled;
  }

  /** @inheritdoc */
  public async flush(): Promise<void> {
    if (this._enabled) await this._original.flush();
  }
  /** @inheritdoc */
  public setProperty(key: string, value: unknown): MetricsLogger {
    if (this._enabled) this.setProperty(key, value);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public putDimensions(dimensions: Record<string, string>): MetricsLogger {
    if (this._enabled) this.putDimensions(dimensions);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setDimensions(...setDimensions: Record<string, string>[]): MetricsLogger {
    if (this._enabled) this.setDimensions(...setDimensions);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public putMetric(key: string, value: number, unit?: string): MetricsLogger {
    if (this._enabled) this.putMetric(key, value, unit);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setNamespace(value: string): MetricsLogger {
    if (this._enabled) this.setNamespace(value);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public setTimestamp(timestamp: number | Date): MetricsLogger {
    if (this._enabled) this.setTimestamp(timestamp);
    return this as unknown as MetricsLogger;
  }
  /** @inheritdoc */
  public new(): MetricsLogger {
    return new OptionalMetricsLogger(this.new(), this._enabled) as unknown as MetricsLogger;
  }
}
