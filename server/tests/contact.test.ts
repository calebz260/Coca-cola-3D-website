import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import type { ContactService } from '../src/services/contactService.js';

const valid = {
  fullName: 'Ada Lovelace',
  email: 'Ada@Example.com',
  subject: 'Collaboration',
  message: 'Hello, I would love to talk about the concept.',
};

function makeApp(overrides: Partial<{ service: ContactService; limit: number; db: boolean }> = {}) {
  const service: ContactService = overrides.service ?? {
    create: vi.fn(async () => ({ id: 'msg_1', createdAt: new Date('2026-01-01T00:00:00Z') })),
  };
  const app = createApp({
    contactService: service,
    checkDatabase: async () => overrides.db ?? true,
    rateLimit: { limit: overrides.limit ?? 100, windowMinutes: 15 },
    corsOrigins: ['http://localhost:5173'],
  });
  return { app, service };
}

describe('POST /api/contact', () => {
  let ctx: ReturnType<typeof makeApp>;
  beforeEach(() => {
    ctx = makeApp();
  });

  it('stores a valid message and returns 201', async () => {
    const res = await request(ctx.app).post('/api/contact').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('msg_1');
    expect(ctx.service.create).toHaveBeenCalledWith({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Collaboration',
      message: valid.message,
    });
  });

  it('returns field errors for invalid input', async () => {
    const res = await request(ctx.app).post('/api/contact').send({ fullName: 'A', email: 'nope', subject: '', message: 'short' });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.fieldErrors).sort()).toEqual(['email', 'fullName', 'message', 'subject']);
    expect(ctx.service.create).not.toHaveBeenCalled();
  });

  it('rejects unexpected fields', async () => {
    const res = await request(ctx.app).post('/api/contact').send({ ...valid, admin: true });
    expect(res.status).toBe(400);
    expect(res.body.fieldErrors.form).toBeDefined();
  });

  it('trims and collapses whitespace in single-line fields', async () => {
    await request(ctx.app).post('/api/contact').send({ ...valid, fullName: '  Ada \n  Lovelace ' });
    expect(ctx.service.create).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'Ada Lovelace' }));
  });

  it('silently drops honeypot submissions', async () => {
    const res = await request(ctx.app).post('/api/contact').send({ ...valid, company: 'Spam Inc' });
    expect(res.status).toBe(201);
    expect(ctx.service.create).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(ctx.app).post('/api/contact').set('Content-Type', 'application/json').send('{"fullName":');
    expect(res.status).toBe(400);
  });

  it('rate limits repeated submissions', async () => {
    const { app } = makeApp({ limit: 2 });
    await request(app).post('/api/contact').send(valid);
    await request(app).post('/api/contact').send(valid);
    const res = await request(app).post('/api/contact').send(valid);
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/Too many messages/);
  });

  it('returns 500 without leaking internals when the service throws', async () => {
    const { app } = makeApp({ service: { create: vi.fn(async () => { throw new Error('secret db detail'); }) } });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = await request(app).post('/api/contact').send(valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });
});

describe('GET /api/health', () => {
  it('reports database status', async () => {
    expect((await request(makeApp().app).get('/api/health')).body).toEqual({ status: 'ok', database: true });
    const down = await request(makeApp({ db: false }).app).get('/api/health');
    expect(down.status).toBe(503);
  });
});

describe('CORS', () => {
  it('allows the configured origin only', async () => {
    const { app } = makeApp();
    const ok = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    const blocked = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });
});
