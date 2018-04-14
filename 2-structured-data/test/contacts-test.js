const expect = require('expect');
const request = require('supertest');

const {app} = require('./../app');

var contactID;

describe('GET /api/contacts', () => {
    it('should get all contacts', (done) => {
        request(app)
        .get('/api/contacts')
        .expect(200)
        .expect((response) => {
            expect(response.body.items).toBeDefined();
            contactID = response.body.items[0].id;
        })
        .end(done);
    });
});

describe('GET /api/contacts/:id', () => {
    it('should return contact doc', (done) => {
        request(app)
        .get(`/api/contacts/${contactID}`)
        .expect(200)
        .expect((response) => {
            expect(response.body).toBeDefined();
        })
        .end(done);
    });
});