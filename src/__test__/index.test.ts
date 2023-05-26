import {describe, expect, test} from '@jest/globals';
import {app} from '../app';
import request from 'supertest';

describe("Test the root path", () => {
    test("It should response Backend", done => {
      request(app)
        .get("/")
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toBe("Backend");
          done();
        });
    });
  });