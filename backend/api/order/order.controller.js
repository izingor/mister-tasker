const logger = require('../../services/logger.service')
const orderService = require('./order.service')

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
}

// LIST
async function getOrders(req, res) {
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
async function getOrderById(req, res) {
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
async function addOrder(req, res) {
  try {
    const order = req.body
    const addedOrderId = await orderService.add(order)
    const addedOrder = await orderService.getById(addedOrderId.insertedId)

    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

// UPDATE
async function updateOrder(req, res) {
  try {
    const order = req.body
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

// DELETE
async function removeOrder(req, res) {
  try {
    const { id } = req.params
    const removedId = await orderService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}
