import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index.js';
import Event from '../src/models/Event.js';
import Package from '../src/models/Package.js';
import Lead from '../src/models/Lead.js';
import env from '../src/config/env.js';

describe('API Endpoints', () => {
  let testEvent;
  let testPackage;
  let testLead;
  
  beforeAll(async () => {
    const testDbUri = env.MONGODB_URI_TEST || env.MONGODB_URI;
    await mongoose.connect(testDbUri);
  });
  
  beforeEach(async () => {
    // Clear and create test data
    await Event.deleteMany({});
    await Package.deleteMany({});
    await Lead.deleteMany({});
    
    // Create test event
    testEvent = await Event.create({
      name: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      startDate: new Date('2026-06-14'), 
      endDate: new Date('2026-06-20'),
      category: 'Cricket'
    });
    
    // Create test package
    testPackage = await Package.create({
      eventId: testEvent._id,
      name: 'Test Package',
      description: 'Test Package Description',
      basePrice: 1000,
      inclusions: ['Test 1', 'Test 2'],
      duration: 5,
      accommodationType: '4-star',
      maxTravelers: 10
    });
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'healthy');
      expect(res.body.data).toHaveProperty('uptime');
      expect(res.body.data).toHaveProperty('database');
    });
  });
  
  describe('Events API', () => {
    describe('GET /api/events', () => {
      it('should return list of events', async () => {
        const res = await request(app).get('/api/events');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });
      
      it('should return events with correct structure', async () => {
        const res = await request(app).get('/api/events');
        
        const event = res.body.data[0];
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('location');
        expect(event).toHaveProperty('startDate');
        expect(event).toHaveProperty('endDate');
      });
    });
    
    describe('GET /api/events/:id/packages', () => {
      it('should return packages for an event', async () => {
        const res = await request(app).get(`/api/events/${testEvent._id}/packages`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
      
      it('should return packages with correct structure', async () => {
        const res = await request(app).get(`/api/events/${testEvent._id}/packages`);
        
        if (res.body.data.length > 0) {
          const pkg = res.body.data[0];
          expect(pkg).toHaveProperty('name');
          expect(pkg).toHaveProperty('basePrice');
          expect(pkg).toHaveProperty('inclusions');
        }
      });
    });
  });
  
  describe('Leads API', () => {
    describe('POST /api/leads', () => {
      it('should create a new lead', async () => {
        const leadData = {
          name: 'Test Lead',
          email: 'test@example.com',
          phone: '+1234567890',
          eventId: testEvent._id.toString(),
          numberOfTravelers: 2,
          travelDate: '2025-12-15'
        };
        
        const res = await request(app)
          .post('/api/leads')
          .send(leadData);
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('status', 'New');
        expect(res.body.data).toHaveProperty('name', leadData.name);
        expect(res.body.data).toHaveProperty('email', leadData.email);
      });
      
      it('should fail without required fields', async () => {
        const res = await request(app)
          .post('/api/leads')
          .send({ name: 'Test' });
        
        expect(res.statusCode).toBe(400);
      });
    });
    
    describe('GET /api/leads', () => {
      beforeEach(async () => {
        testLead = await Lead.create({
          name: 'Test Lead',
          email: 'lead@example.com',
          phone: '+1234567890',
          eventId: testEvent._id,
          numberOfTravelers: 2,
          travelDate: new Date('2025-12-15'),
          status: 'New'
        });
      });
      
      it('should return paginated leads', async () => {
        const res = await request(app).get('/api/leads?page=1&limit=10');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('leads');
        expect(res.body.data).toHaveProperty('pagination');
        expect(res.body.data.pagination).toHaveProperty('total');
        expect(res.body.data.pagination).toHaveProperty('page');
      });
      
      it('should filter leads by status', async () => {
        const res = await request(app).get('/api/leads?status=New');
        
        expect(res.statusCode).toBe(200);
        res.body.data.leads.forEach(lead => {
          expect(lead.status).toBe('New');
        });
      });
    });
    
    describe('PATCH /api/leads/:id/status', () => {
      beforeEach(async () => {
        testLead = await Lead.create({
          name: 'Test Lead',
          email: 'lead@example.com',
          phone: '+1234567890',
          eventId: testEvent._id,
          numberOfTravelers: 2,
          travelDate: new Date('2025-06-15'),
          status: 'New'
        });
      });
      
      it('should update lead status with valid transition', async () => {
        const res = await request(app)
          .patch(`/api/leads/${testLead._id}/status`)
          .set('x-api-key', env.ADMIN_API_KEY)
          .send({ status: 'Contacted', notes: 'Test note' });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('status', 'Contacted');
      });
      
      it('should reject invalid status transition', async () => {
        const res = await request(app)
          .patch(`/api/leads/${testLead._id}/status`)
          .set('x-api-key', env.ADMIN_API_KEY)
          .send({ status: 'Closed Won' });
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('success', false);
      });
      
      it('should return 404 for non-existent lead', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .patch(`/api/leads/${fakeId}/status`)
          .set('x-api-key', env.ADMIN_API_KEY)
          .send({ status: 'Contacted' });
        
        expect(res.statusCode).toBe(404);
      });
    });
  });
  
  describe('Quotes API', () => {
    beforeEach(async () => {
      testLead = await Lead.create({
        name: 'Test Lead',
        email: 'lead@example.com',
        phone: '+1234567890',
        eventId: testEvent._id,
        numberOfTravelers: 4,
        travelDate: new Date('2025-12-15'),
        status: 'Contacted'
      });
    });
    
    describe('POST /api/quotes/generate', () => {
      it('should generate a quote successfully', async () => {
        const quoteData = {
          leadId: testLead._id.toString(),
          eventId: testEvent._id.toString(),
          packageId: testPackage._id.toString(),
          numberOfTravelers: 4,
          travelDate: '2026-06-14'
        };
        
        const res = await request(app)
          .post('/api/quotes/generate')
          .send(quoteData);
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('quoteId');
        expect(res.body.data).toHaveProperty('basePrice');
        expect(res.body.data).toHaveProperty('adjustments');
        expect(res.body.data).toHaveProperty('finalPrice');
        expect(res.body.data).toHaveProperty('leadStatus', 'Quote Sent');
      });
      
      it('should apply correct pricing adjustments', async () => {
        const quoteData = {
          leadId: testLead._id.toString(),
          eventId: testEvent._id.toString(),
          packageId: testPackage._id.toString(),
          numberOfTravelers: 4,
          travelDate: '2026-06-13' 
        };
        
        const res = await request(app)
          .post('/api/quotes/generate')
          .send(quoteData);
        
        const { adjustments } = res.body.data;
        
        expect(adjustments.seasonalMultiplier.percentage).toBe(20);
        
        expect(adjustments.groupDiscount.percentage).toBe(8);
        
        expect(adjustments.weekendSurcharge.percentage).toBe(8);
      });
      
      it('should update lead status to Quote Sent', async () => {
        const quoteData = {
          leadId: testLead._id.toString(),
          eventId: testEvent._id.toString(),
          packageId: testPackage._id.toString(),
          numberOfTravelers: 2,
          travelDate: '2025-12-15'
        };
        
        await request(app)
          .post('/api/quotes/generate')
          .send(quoteData);
        
        const updatedLead = await Lead.findById(testLead._id);
        expect(updatedLead.status).toBe('Quote Sent');
      });
      
      it('should fail with missing required fields', async () => {
        const res = await request(app)
          .post('/api/quotes/generate')
          .send({ leadId: testLead._id.toString() });
        
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
    });
  });
});
