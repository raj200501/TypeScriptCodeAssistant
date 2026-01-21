export type OTelState = {
  enabled: boolean;
  serviceName: string;
};

export const maybeInitOtel = (options: { serviceName?: string } = {}): OTelState => {
  const enabled = process.env.ENABLE_OTEL === '1';
  const serviceName = options.serviceName ?? 'tca';
  return { enabled, serviceName };
};
