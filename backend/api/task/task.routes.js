const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getTasks, getTaskById, addTask, updateTask, removeTask } = require('./task.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders);
router.get('/:id', getOrderById);
// router.post('/', addOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', removeOrder)
router.post('/', addOrder);
router.put('/:id', updateOrder);
router.delete('/:id', removeOrder);

module.exports = router;
