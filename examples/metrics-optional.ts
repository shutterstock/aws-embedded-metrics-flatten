import type * as lambda from 'aws-lambda';
import { metricScope, Unit as metricUnit } from 'aws-embedded-metrics';
import { FlatCountMetrics, metricScopeDummy } from '@shutterstock/aws-embedded-metrics-flatten';

const { EMIT_METRICS = 'true' } = process.env;
const config = {
  emitMetrics: EMIT_METRICS === 'true',
};

// metricScopeDummy implements the same interface as metricsScope
// it just discards all data and does nothing instead of emitting
// metrics data
const enableMetricScope = config.emitMetrics ? metricScope : metricScopeDummy;

export const handler = enableMetricScope(
  (metrics) =>
    async (payload: lambda.MSKEvent, context?: lambda.Context): Promise<void> => {
      const flatMetrics = new FlatCountMetrics();
      try {
        metrics.putMetric('SomeCriticalMetric', 1, metricUnit.Count);
        await metrics.flush();

        flatMetrics.putMetric('WorksWithFlatMetricsToo', 1, metricUnit.Count);
      } finally {
        // Flush the flattened metrics
        // This will result in a single `MyFlatMetric` item with a count of 10,000 in
        // embedded metrics output instead of a 10,000 element array of 1's
        flatMetrics.flush(metrics);
      }
    },
);

// Allow this code to be copy/pasted into a Lambda function
// Only call the handler if we're being invoked on a TTY
if (process.stdout.isTTY) {
  void handler({
    records: {
      'some-topic': [
        {
          topic: 'some-topic',
          partition: 0,
          offset: 0,
          timestamp: 1234567890,
          timestampType: 'CREATE_TIME',
          headers: [],
          key: 'key',
          value: 'some-value',
        },
      ],
    },
    eventSource: 'aws:kafka',
    eventSourceArn:
      'arn:aws:kafka:us-east-1:123456789012:cluster/my-cluster/12345678-1234-1234-1234-123456789012-1',
    bootstrapServers:
      'b-1.my-cluster.1234.abcd.us-east-1.amazonaws.com:9092,b-2.my-cluster.1234.abcd.us-east-1.amazonaws.com:9092',
  });
}
