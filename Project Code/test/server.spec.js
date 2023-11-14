const server = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const {assert, expect} = chai;

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
});
