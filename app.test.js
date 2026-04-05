const request = require('supertest');
const app = require('./server');

describe('API Tests', () => {

  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('POST /api/order', async () => {
    const res = await request(app)
      .post('/api/order')
      .send({
        name: "Anu",
        items: [{ name: "Dosa", qty: 2 }]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("Booked");
    expect(res.body.token).toBeDefined();
  });

});