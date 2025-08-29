const { Router } = require('express');
const dogController = require('../controllers/dogController')
const router = Router();

router.get('/registerdogs', dogController.registerdogs_get);
router.post('/registerdogs', dogController.registerdogs_post);
router.get('/dogs/:id', dogController.dogsid_get);
router.post('/adoptdog/:id', dogController.adoptdogid_post);
router.post('/removedog/:id', dogController.removedogid_post);
router.get('/mydogs', dogController.mydogs_get);
module.exports = router;