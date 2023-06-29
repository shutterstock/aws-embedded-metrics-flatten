import { MetricsLogger, Unit } from 'aws-embedded-metrics';

export class FlatCountMetrics {
  private metrics = new Map<string, { value: number; unit: Unit }>();

  /**
   * Accumulate (add together) values for `putMetric` calls for Units that
   * can be added (e.g. everything except the PerSecond Units).
   *
   * Emit the accumulated metrics to a `MetricsLogger` class when
   * `flush` is called.  Note that the `MetricsLogger` must then be
   * flushed or used with `metricsScope` to ensure it is flushed.
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Get the value for a specified metric key, if desired
   * @param key
   * @returns
   */
  public getMetric(key: string): { value: number; unit: Unit } {
    const metric = this.metrics.get(key);
    if (metric === undefined) {
      throw new Error(`metric not found: ${key}`);
    }
    return { value: metric.value, unit: metric.unit };
  }

  /**
   * Put a metric value.
   * These values will only be emitted to CloudWatch when flush() is called,
   * which will put the current count into a metric.
   * @param key
   * @param value
   * @param unit Any Unit that can be aggregated (e.g. Count, Bytes, Milliseconds but not BytesPerSecond)
   */
  public putMetric(key: string, value: number, unit: Unit): FlatCountMetrics {
    const nonCountMetrics = [
      Unit.BytesPerSecond,
      Unit.KilobytesPerSecond,
      Unit.MegabytesPerSecond,
      Unit.GigabytesPerSecond,
      Unit.TerabytesPerSecond,
      Unit.BitsPerSecond,
      Unit.KilobitsPerSecond,
      Unit.MegabitsPerSecond,
      Unit.GigabitsPerSecond,
      Unit.TerabitsPerSecond,
      Unit.CountPerSecond,
    ];
    if (nonCountMetrics.includes(unit)) {
      // This unit cannot be accumulated (added together)
      throw new TypeError(
        `${unit} cannot be added togther - use MetricsLogger directly for this Unit`,
      );
    }

    const currentMetric = this.metrics.get(key);
    if (currentMetric) {
      currentMetric.value += value;
    } else {
      this.metrics.set(key, { value, unit });
    }
    return this;
  }

  /**
   * Write the accumulated counts through to an object implementing the
   * MetricsLogger interface and releases the accumulated map of metric names
   * and counts.  Subsequent calls to `putMetric` will need another call
   * to `flush`.
   *
   * @param logger MetricsLogger or MetricsLoggerDummy
   */
  public flush(logger: MetricsLogger): void {
    for (const metric of this.metrics) {
      logger.putMetric(metric[0], metric[1].value, metric[1].unit);
    }
    this.metrics = new Map();
  }
}
