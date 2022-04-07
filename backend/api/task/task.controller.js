const logger = require('../../services/logger.service')
const orderService = require('./task.service')

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
}

// LIST
async function getTasks(req, res) {
  try {
    const filterBy = req.query
    const orders = await orderService.query(filterBy)
    res.json(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

// READ
async function getTaskById(req, res) {
  try {
    const { id } = req.params
    const order = await orderService.getById(id)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

// CREATE
async function addTask(req, res) {
  try {
    const order = req.body
    const addedTaskId = await orderService.add(order)
    const addedTask = await orderService.getById(addedTaskId.insertedId)

    res.json(addedTask)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

// UPDATE
async function updateTask(req, res) {
  try {
    const order = req.body
    const updatedTask = await orderService.update(order)
    res.json(updatedTask)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

// DELETE
async function removeTask(req, res) {
  try {
    const { id } = req.params
    const removedId = await orderService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}
