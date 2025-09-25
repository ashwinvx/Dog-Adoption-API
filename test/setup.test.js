process.env.NODE_ENV = 'test';

const Dog = require('../models/Dog');
const User = require('../models/User');


//clean up the database before and after each test
beforeEach((done) => {
    Dog.deleteMany({})
        .then(result => {
            console.log(`${result.deletedCount} documents deleted.`);
        })
        .catch(error => {
            console.error('Error deleting documents:', error);
        });
    User.deleteMany({})
        .then(result => {
            console.log(`${result.deletedCount} documents deleted.`);
        })
        .catch(error => {
            console.error('Error deleting documents:', error);
        });
    done();
});

afterEach((done) => {
    User.deleteMany({})
        .then(result => {
            console.log(`${result.deletedCount} documents deleted.`);
        })
        .catch(error => {
            console.error('Error deleting documents:', error);
        });
    Dog.deleteMany({})
        .then(result => {
            console.log(`${result.deletedCount} documents deleted.`);
        })
        .catch(error => {
            console.error('Error deleting documents:', error);
        });
    done();
});
