const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getTasks, getTaskById, addTask, updateTask, removeTask, startTask, runWorker } = require('./task.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getTasks);
router.get('/:id', getTaskById);
router.post('/', addTask);
router.put('/runworker', runWorker);
router.put('/:id', updateTask);
router.put('/:id/start', startTask);
router.delete('/:id', removeTask);
// router.post('/', requireAuth, addTask)
// router.put('/:id', requireAuth, updateTask)
// router.delete('/:id', requireAuth, removeTask)

module.exports = router;
