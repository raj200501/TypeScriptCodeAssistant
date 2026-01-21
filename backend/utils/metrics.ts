type LabelValue = string | number | boolean;

type MetricEntry = {
  name: string;
  labels: Record<string, LabelValue>;
  count: number;
  totalMs: number;
  maxMs: number;
};

const sanitizeLabelValue = (value: LabelValue) => {
  return String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
};

const labelKey = (labels: Record<string, LabelValue>) => {
  return Object.keys(labels)
    .sort()
    .map((key) => `${key}=${sanitizeLabelValue(labels[key])}`)
    .join(',');
};

const formatLabels = (labels: Record<string, LabelValue>) => {
  const entries = Object.keys(labels)
    .sort()
    .map((key) => `${key}="${sanitizeLabelValue(labels[key])}"`);
  return entries.length ? `{${entries.join(',')}}` : '';
};

export const createMetricsRegistry = () => {
  const entries = new Map<string, MetricEntry>();

  const observeDuration = (
    name: string,
    durationMs: number,
    labels: Record<string, LabelValue> = {},
  ) => {
    const key = `${name}|${labelKey(labels)}`;
    const existing = entries.get(key);
    if (existing) {
      existing.count += 1;
      existing.totalMs += durationMs;
      existing.maxMs = Math.max(existing.maxMs, durationMs);
      return;
    }
    entries.set(key, {
      name,
      labels,
      count: 1,
      totalMs: durationMs,
      maxMs: durationMs,
    });
  };

  const startTimer = (name: string, labels: Record<string, LabelValue> = {}) => {
    const start = process.hrtime.bigint();
    return () => {
      const diff = Number(process.hrtime.bigint() - start) / 1_000_000;
      observeDuration(name, diff, labels);
    };
  };

  const render = () => {
    const lines = [
      '# HELP tca_http_request_duration_ms HTTP request duration in milliseconds',
      '# TYPE tca_http_request_duration_ms summary',
    ];
    for (const entry of entries.values()) {
      const labels = formatLabels(entry.labels);
      lines.push(`tca_http_request_duration_ms_count${labels} ${entry.count}`);
      lines.push(`tca_http_request_duration_ms_sum${labels} ${entry.totalMs.toFixed(3)}`);
      lines.push(`tca_http_request_duration_ms_max${labels} ${entry.maxMs.toFixed(3)}`);
    }
    return `${lines.join('\n')}\n`;
  };

  return {
    observeDuration,
    startTimer,
    render,
  };
};
