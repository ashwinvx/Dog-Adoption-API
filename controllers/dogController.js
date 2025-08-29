const Dog = require('../models/Dog');

module.exports.registerdogs_get = (req, res) => {
    res.render('registerdogs');
}

module.exports.registerdogs_post = async (req, res) => {
    const { name, breed, age, description } = req.body;
    const ownerInfo = req.userId;
    console.log('ownerInfo-->', req.userId);
    try {
        const dog = await Dog.create({ name, breed, age, description, ownerInfo });
        res.status(201).json({ dog: dog._id });
    } catch (err) {
        // const errors = handleErrors(err);
        // res.status(400).json({ errors });
    }
}

module.exports.dogsid_get = async (req, res) => {
    console.log('dog id-->', req.params.id);
    const dog = await Dog.findById(req.params.id);
    if (dog) {
        console.log('dog-->', dog.toObject());
        res.render('doginfo', dog.toObject());
    }
}

module.exports.adoptdogid_post = async (req, res) => {
    const dog = await Dog.findById(req.params.id);
    if (dog) {
        dog.adoptionStatus = 'adopted';
        dog.adoptedOwnerInfo = req.userId;
        const updateddog = await dog.save();
        console.log('updated dog info-->', updateddog);
        res.status(201).json({ dog: updateddog });
    }
}

module.exports.removedogid_post = async (req, res) => {
    console.log('dog id-->', req.url);
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    if (!deletedDog) {
        console.log('dog not found');
        return null;
    }
    console.log('dog successfully removed', deletedDog);
    res.status(201).json({ dog: deletedDog });
}

module.exports.mydogs_get = async (req, res) => {
    const filter = req.query.dogs;
    console.log('filter-->', filter);
    let dogs;
    if (filter == 'registered') {
        dogs = await Dog.find({ ownerInfo: req.userId });
    }
    else if (filter == 'adopted') {
        dogs = await Dog.find({ adoptedOwnerInfo: req.userId });
    }
    if (dogs) {
        console.log('mydogs-->', dogs);
        res.render('mydogs', { title: 'My dogs', dogs: dogs });
    }
}
