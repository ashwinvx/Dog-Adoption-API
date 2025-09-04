const ExpressError = require('../middlewares/expressError');
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
        res.status(500).json({ error: 'Internal Server Error' });
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
    if (dog && dog.adoptionStatus !== 'adopted' && !dog.ownerInfo.equals(req.userId)) {
        dog.adoptionStatus = 'adopted';
        dog.adoptedOwnerInfo = req.userId;
        const updateddog = await dog.save();
        console.log('updated dog info-->', updateddog);
        res.status(201).json({ dog: updateddog });
    }
}

module.exports.removedogid_post = async (req, res) => {
    const dog = await Dog.findById(req.params.id);
    console.log('dog owner-->', dog.ownerInfo);
    console.log('logged in user-->', req.userId);
    if (dog && dog.adoptionStatus !== 'adopted' && dog.ownerInfo.equals(req.userId)) {
        const result = await Dog.deleteOne({ _id: dog._id });
        if (result.deletedCount > 0) {
            console.log('dog successfully removed', result);
            res.status(201).json({ dog: 'deleted' });
        } else {
            console.log('dog not found');
            res.status(400).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports.mydogs_get = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const category = req.query.category;
    const skip = (page - 1) * limit; // Calculate documents to skip for pagination
    console.log('category-->', category);
    try {
        let dogs, title, totalDogs, totalPages;
        if (category == 'registered') {
            dogs = await Dog.find({ ownerInfo: req.userId })
                .skip(skip)
                .limit(limit);
            totalDogs = await Dog.countDocuments({ ownerInfo: req.userId });
            title = 'My dogs';
        }
        else if (category == 'adopted') {
            dogs = await Dog.find({ adoptedOwnerInfo: req.userId })
                .skip(skip)
                .limit(limit);
            totalDogs = await Dog.countDocuments({ adoptedOwnerInfo: req.userId });
            title = 'My adopted dogs';
        } else {
            throw new ExpressError("category not found", 400);
        }
        totalPages = Math.ceil(totalDogs / limit);
        if (dogs) {
            console.log('mydogs-->', dogs);
            res.render('mydogs', { title, dogs });
        }
    } catch (error) {
        next(error)
    }
}
