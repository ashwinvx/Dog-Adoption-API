process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);


describe('/User workflow tests', () => {

    it('should register + login a user, register a dog and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            email: "mail@petersen.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/signup')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        console.log('jwt-->', res.body);
                        let token = res.body.token;

                        // 3) Register new dog
                        let dog =
                        {
                            name: "Juno",
                            breed: "Golden Retriever",
                            age: 5,
                            description: 'happy dog'
                        };

                        chai.request(server)
                            .post('/api/dogs/register')
                            .set('Cookie', `jwt=${token}`)
                            .send(dog)
                            .end((err, res) => {
                                console.log('res-->', res.body);
                                // Asserts
                                expect(res.status).to.be.equal(201);
                                expect(res.body.dog).to.be.a('Object');

                                let savedDog = res.body.dog;
                                expect(savedDog.name).to.be.equal(dog.name);
                                expect(savedDog.breed).to.be.equal(dog.breed);
                                expect(savedDog.age).to.be.equal(dog.age);
                                expect(savedDog.description).to.be.equal(dog.description);
                                done();

                                // 4) Verify one dog in test DB
                                // chai.request(server)
                                //     .get('/api/dogs/' + savedDog._id)
                                //     .end((err, res) => {
                                //         console.log('dogg-->', res.body);
                                //         // Asserts
                                //         expect(res.status).to.be.equal(200);
                                //         expect(res.body).to.be.a('array');
                                //         expect(res.body.length).to.be.eql(1);

                                //         done();
                                //     });
                            });
                    });
            });
    });

})