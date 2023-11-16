const server = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const {assert, expect} = chai;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

describe('GET /login', () => {
  it('should render the login page', (done) => {
    chai.request(server)
      .get('/login')
      .end((err, res) => {
        // Check for server errors
        expect(err).to.be.null;

        // Check status code
        expect(res).to.have.status(200);

        // Check if the content type is HTML
        expect(res).to.be.html;

        // Check for the presence of elements within the body
        expect(res.text).to.contain('Login');
        expect(res.text).to.contain('name="email"');
        expect(res.text).to.contain('name="password"');
        expect(res.text).to.contain('type="submit"');

        // Check for the form's action attribute to be correct
        expect(res.text).to.match(/<form action="\/login" method="POST"/);

        done();
      });
  });
    it('positive : should login the user', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                email: 'user1@gmail.com',
                password: 'pass1'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                console.log(res.text);
                expect(res.text).to.contain('Login');
                done();
            });
    });
    it('negative : should not login the user', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                email: 'incorrect@gmail.com',
                password: 'incorrect'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.not.contain('to /home');
                done();
            });
    });
});


describe('GET /register', () => {
    it('negative : should not register the user', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                firstNAME: 'Random',
                lastNAME: 'User',
                email: 'user1@gmail.com',
                password: 'pass1'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.not.contain('Redirecting to /home');
                done();
            });
    });
    it('positive : should register the user', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                firstNAME: 'Random',
                lastNAME: 'User',
                email: 'user'+getRandomInt(40,400)+'@gmail.com',
                password: 'pass1'
            })
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.contain('<button type="submit" class="btn btn-primary">Login</button>');
            done();
        }); 
    });
});
