const server = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const { assert, expect } = chai;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

/*

Test cases:

1. Login
    1.1. Positive - Check if you can get login page
    1.2. Positive - Check if you can login with correct credentials user1@gmail.com, pass1 (the user should be redirected to /home)
    1.3. Negative - Check if you can login with incorrect credentials (the user should not be redirected to /home, but instead should be redirected to /login)
2. Register
    2.1. Positive - Check if you can get register page
    2.2. Positive - Check if you can register with a new email (the user should be redirected to /login) (random email)
    2.3. Negative - Check if you can register with an existing email (the user should not be redirected to /login, but instead should be redirected to /register)

*/

describe('Login', () => {
    describe('GET /login', () => {
        it('should get login page', (done) => {
            chai.request(server)
                .get('/login')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('should login with correct credentials', (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    email: 'user1@gmail.com',
                    password: 'pass1'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.redirects[0]).to.include('/home');
                    done();
                }
                );
        }
        );

        it('should not login with incorrect credentials', (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    email: 'notuser@user.com',
                    password: 'notpass'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.redirects[0]).to.not.include('/home');
                    done();
                }
                );
        }
        );
    }
    );
});

describe('Register', () => {
    describe('GET /register', () => {
        it('should get register page', (done) => {
            chai.request(server)
                .get('/register')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST /register', () => {
        it('should register with new email', (done) => {
            chai.request(server)
                .post('/register')
                .send({
                    email: `user${getRandomInt(0, 100000)}@gmail.com`,
                    password: 'pass1',
                    password2: 'pass1'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.redirects[0]).to.include('/login');
                    done();
                }
                );
        }
        );

        it('should not register with existing email', (done) => {
            chai.request(server)
                .post('/register')
                .send({
                    email: 'user1@gmail.com',
                    password: 'pass1'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.redirects[0]).to.not.include('/login');
                    done();
                }
                );
        }
        );
    }
    );
}
);


