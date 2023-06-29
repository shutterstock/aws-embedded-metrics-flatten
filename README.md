[![npm (scoped)](https://img.shields.io/npm/v/%40shutterstock/aws-embedded-metrics-flatten)](https://www.npmjs.com/package/@shutterstock/aws-embedded-metrics-flatten) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![API Docs](https://img.shields.io/badge/API%20Docs-View%20Here-blue)](https://tech.shutterstock.com/aws-embedded-metrics-flatten/) [![Build - CI](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/ci.yml/badge.svg)](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/ci.yml) [![Package and Publish](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/publish.yml/badge.svg)](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/publish.yml) [![Publish Docs](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/docs.yml/badge.svg)](https://github.com/shutterstock/aws-embedded-metrics-flatten/actions/workflows/docs.yml)

# Overview

Extensions for the [aws-embedded-metrics](https://www.npmjs.com/package/aws-embedded-metrics) npm module, adding flatcount metrics that emit a total count instead of an array of each individual count, and the ability to disable metrics without removing metrics method calls.

## Installation

The package is available on npm as [@shutterstock/aws-embedded-metrics-flatten](https://www.npmjs.com/package/@shutterstock/aws-embedded-metrics-flatten)

`npm i @shutterstock/aws-embedded-metrics-flatten`

## Importing

```typescript
import { FlatCountMetrics, metricScopeDummy } from '@shutterstock/aws-embedded-metrics-flatten';
```

# Features

- Flattens count metrics into a single emitted line
  - This works around the max length limitation of CloudWatch Embedded Metrics log messages
  - Rather than emitting an array, such as `[1, 1, 1, 1, 1]`, it emits a single count of `[5]`, dramatically reducing the size of the log message when counting thousands of iterations in a Lambda function
- Gives the ability to disable the metrics without having to protect each metric emit with a conditional

# Flattening Count Metrics

CloudWatch embedded metrics (parsed from CloudWatch logs) have a limit of something like 1,000 items in a metrics log statement. Metrics beyond that point will be ignored.

`aws-embedded-metrics` will emit metrics with `10,000` calls to `.putMetric('MyMetric', 1, metricUnit.Count);` as an array with 10,000 elements all with the value of `1`... and about `9,000` of those will get ignored as a result.

# Optional Metrics

`metricScopeDummy` is a replacement for `metricScope` that will pass an `MetricsLoggerDummy` instance instead of a `MetricsLogger` instance to the callback function. `MetricsLoggerDummy` implements the same interface as `MetricsLogger` but it does not accumulate data and does not emit any logs.

Coupled with a configuration setting / env var it is possible to emit metrics or not emit metrics by changing which function is used to create the `metrics` object.

# Contributing

## Setting up Build Environment

- `nvm use`
- `npm i`
- `npm run build`
- `npm run lint`
- `npm run test`

## Running Examples

### metrics-flatten

1. `npm run example:metrics-flatten`
   1. Will print 2 lines of metrics
   2. `MyFlatMetric` will have a single value of `10000`
2. `FLATTEN_METRICS=false npm run example:metrics-flatten`
   1. Will print many lines of metrics
   2. `MyFlatMetric` will have 10,000 values of `1` across many different lines

### metrics-optional

1. `npm run example:metrics-optional`
   1. Metrics will print
2. `EMIT_METRICS=false npm run example:metrics-optional`
   1. Metrics will not print
