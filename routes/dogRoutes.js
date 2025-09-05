const { Router } = require('express');
const dogController = require('../controllers/dogController')
const router = Router();

router.get('/register', dogController.registerdogs_get);
router.post('/register', dogController.registerdogs_post);
router.get('/:id', dogController.dogsid_get);
router.post('/adopt/:id', dogController.adoptdogid_post);
router.post('/remove/:id', dogController.removedogid_post);
router.get('/', dogController.mydogs_get);
module.exports = router;