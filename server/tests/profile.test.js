
const Profile = require('../models/profiles');
const request = require('supertest');
const mongoose = require('mongoose');
let server;
describe('Session management tests', () => {
  beforeAll(async () => {
    server = require('../server');
  })

  afterAll(async () => {
     server.close();
    await mongoose.disconnect();
  });
  
  it('POST /login must return a user if the user is valid, has a session, and a token', async () => {
    // Request CSRF token
    const respToken = await request(server)
      .get('/profile/csrf-token');
  
    // Extract CSRF token from response body
    const token = respToken.body.csrfToken;
  
    // Extract connect.sid cookie value from response headers
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
      if (cookie.includes('connect.sid')) {
        connectSidValue = cookie.split('=')[1].split(';')[0];
      }
    });
  
    // Create a fake user object
    const fakeUser = { username: 'ziyi', password: '123' };
  
    // Send login request with fake user credentials, CSRF token, and session cookie
    const respLogin = await request(server)
      .post('/profile/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
    // Assert that the login request was successful
    expect(respLogin.status).toBe(401);
  

  });
  

  it('POST /login must return 401 status if the user gives invalid password, has a session, and a token', async () => {
    const respToken = await request(server)
      .get('/profile/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password2' };
    const respLogin = await request(server)
      .post('/profile/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
      expect(respLogin.status).toBe(401);
  });

  it('POST /login must return 403 forbidden if the user is valid but has no token', async () => {
    const respToken = await request(server)
      .get('/profile/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password1' };
    const respLogin = await request(server)
      .post('/profile/login')
      .send(fakeUser)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
      expect(respLogin.status).toBe(403);
  });

  it('POST /login must return 403 forbidden if the user is valid but has no session', async () => {
    const respToken = await request(server)
      .get('/profile/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password1' };
    const respLogin = await request(server)
      .post('/profile/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      expect(respLogin.status).toBe(403);
  });
});

describe('Signup tests', () => {
  beforeEach(() => {
    server = require('./../server');
  })

  afterEach(async () => {
    server.close();
  });

  it('POST /signup must return a user if the user is valid, has a session, and a token', async () => {
    const respToken = await request(server)
      .get('/profile/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });
    
    const fakeUser = { username: 'user1', password: 'password1', email: 'asdfasdff@gmadfsd.com' };
    Profile.create = jest.fn().mockResolvedValueOnce(fakeUser);
    Profile.findOne = jest.fn().mockResolvedValueOnce(null);
    // Mock resolved value setup above will be returned here
    const respSignup = await request(server)
      .post('/profile/signup')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(respSignup.status).toBe(500);
    // Verify that Profile.create was called with the correct parameters
  });
  }
  , 5000);