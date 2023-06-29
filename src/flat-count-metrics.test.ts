//flat-count-metrics.test.ts
/// <reference types="jest" />

import { MetricsLogger, Unit } from 'aws-embedded-metrics';
import { FlatCountMetrics } from './flat-count-metrics';
jest.mock('aws-embedded-metrics');

describe('Flat Count Metrics', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('counts correctly', () => {
    const metrics = new FlatCountMetrics();

    metrics.putMetric('SomeMetric', 1, Unit.Count);
    metrics.putMetric('SomeMetric', 1, Unit.Count);

    expect(metrics.getMetric('SomeMetric').value).toBe(2);
    expect(metrics.getMetric('SomeMetric').unit).toBe(Unit.Count);
  });

  it('flushes to putMetric', () => {
    const metrics = new FlatCountMetrics();
    // @ts-expect-error
    const logger = new MetricsLogger();

    metrics.putMetric('SomeMetric', 1, Unit.Count);
    metrics.putMetric('SomeMetric', 1, Unit.Count);

    metrics.flush(logger);

    expect(logger.putMetric).toBeCalled();
    expect(logger.putMetric).toBeCalledWith('SomeMetric', 2, Unit.Count);
  });

  it('throws on units that cannot be aggregated', () => {
    const metrics = new FlatCountMetrics();
    expect(() => metrics.putMetric('SomeMetric', 1, Unit.BytesPerSecond)).toThrowError(
      'Bytes/Second cannot be added togther - use MetricsLogger directly for this Unit',
    );
  });
});
