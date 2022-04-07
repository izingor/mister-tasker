const logger = require('../../services/logger.service')
const taskService = require('./task.service')

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
  performTask
}
async function performTask(req, res) {
  try {
    const { id } = req.params
    var task = await taskService.getTaskById(id)
    var updatedTask = await taskService.performTask(task)
    res.json(updatedTask)
  } catch (err) {
    logger.error('Failed to performTask', err)
    res.status(500).send({ err: 'Failed to performTask' })
  }
}
// LIST
async function getTasks(req, res) {
  try {
    const filterBy = req.query
    const tasks = await taskService.query(filterBy)
    res.json(tasks)
  } catch (err) {
    logger.error('Failed to get tasks', err)
    res.status(500).send({ err: 'Failed to get tasks' })
  }
}

// READ
async function getTaskById(req, res) {
  try {
    const { id } = req.params
    const task = await taskService.getById(id)
    res.json(task)
  } catch (err) {
    logger.error('Failed to get task', err)
    res.status(500).send({ err: 'Failed to get task' })
  }
}

// CREATE
async function addTask(req, res) {
  try {
    const task = req.body
    const addedTaskId = await taskService.add(task)
    const addedTask = await taskService.getById(addedTaskId.insertedId)

    res.json(addedTask)
  } catch (err) {
    logger.error('Failed to add task', err)
    res.status(500).send({ err: 'Failed to add task' })
  }
}

// UPDATE
async function updateTask(req, res) {
  try {
    const task = req.body
    const updatedTask = await taskService.update(task)
    res.json(updatedTask)
  } catch (err) {
    logger.error('Failed to update task', err)
    res.status(500).send({ err: 'Failed to update task' })
  }
}

// DELETE
async function removeTask(req, res) {
  try {
    const { id } = req.params
    const removedId = await taskService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove task', err)
    res.status(500).send({ err: 'Failed to remove task' })
  }
}
