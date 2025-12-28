import request from 'supertest';
import app from './app-verified';

describe('analysis endpoints', () => {
  it('analyzes code', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({ code: 'var x = 1;' });
    expect(response.status).toBe(200);
    expect(response.body.diagnostics.length).toBeGreaterThan(0);
  });

  it('formats code', async () => {
    const response = await request(app)
      .post('/api/format')
      .send({ code: 'const x=1;' });
    expect(response.status).toBe(200);
    expect(response.body.formatted).toContain('const x = 1');
  });
});
