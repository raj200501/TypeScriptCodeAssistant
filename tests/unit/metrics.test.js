const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const metricsPath = path.resolve(__dirname, '../../backend/dist/utils/metrics.js');
const { createMetricsRegistry } = require(metricsPath);

test('metrics registry records and renders durations', () => {
  const metrics = createMetricsRegistry();
  metrics.observeDuration('http_request', 12.5, { method: 'GET', path: '/health', status: 200 });
  metrics.observeDuration('http_request', 7.5, { method: 'GET', path: '/health', status: 200 });
  const output = metrics.render();
  assert.ok(output.includes('tca_http_request_duration_ms_count'));
  assert.ok(output.includes('method="GET"'));
  assert.ok(output.includes('path="/health"'));
  assert.ok(output.includes('status="200"'));
});
