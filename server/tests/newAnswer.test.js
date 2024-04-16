// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");

// Mock the Answer model
jest.mock("../models/answers");

let server;
describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "661db7760c6758742971c3e2",
      ans: {
        text: "This is a test answer",
        ans_by:"testans"
      }
    };
    const respToken = await supertest(server)
      .get('/profile/csrf-token');
    console.log(respToken);
  
    // Extract CSRF token from response body
    const token = respToken.body.csrfToken;
  
    // Extract connect.sid cookie value from response headers
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
      if (cookie.includes('connect.sid')) {
        connectSidValue = cookie.split('=')[1].split(';')[0];
      }
    });
  
    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer",
      ans_by: "testans",
    }
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "661db7760c6758742971c3e2",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
    console.log(response);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);



  });
});
