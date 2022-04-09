const logger = require('../../services/logger.service');
const taskService = require('./task.service');

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
  runWorker,
  startTask
};
async function startTask(req, res) {
  // res.send(id)
  try {
    const { id } = req.params;
    var task = await taskService.getById(id);
    console.log('got the task by id',task);
    var updatedTask = await taskService.performTask(task);
    res.json(updatedTask);
  } catch (err) {
    logger.error('Failed to performTask', err);
    res.status(500).send({ err: 'Failed to performTask controller' });
  }
}
//worker

async function runWorker() {
  console.log('run worker');
  // The isWorkerOn is toggled by the button: "Start/Stop Task Worker"
  // if (!isWorkerOn) return;
  var delay = 5000;
  try {
    const task = await taskService.getNextTask();
    console.log('worker task',task);
    if (task) {
      try {
        await taskService.performTask(task);
      } catch (err) {
        console.log(`Failed Task`, err);
      } finally {
        delay = 1;
      }
    } else {
      console.log('Snoozing... no tasks to perform');
    }
  } catch (err) {
    console.log(`Failed getting next task to execute`, err);
  } finally {
    setTimeout(runWorker, delay);
  }
}

// LIST - working without filter
async function getTasks(req, res) {
  try {
    // const filterBy = req.query;
    const tasks = await taskService.query();
    res.json(tasks);
  } catch (err) {
    logger.error('Failed to get tasks', err);
    res.status(500).send({ err: 'Failed to get tasks' });
  }
}

// READ - working !!!
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await taskService.getById(id);
    res.json(task);
  } catch (err) {
    logger.error('Failed to get task', err);
    res.status(500).send({ err: 'Failed to get task' });
  }
}

// CREATE-Working!!!
async function addTask(req, res) {
  const task = req.body;
  task.createdAt = Date.now();
  task.lastTriedAt = null;
  task.triesCount = 0;
  task.doneAt = null;
  task.errors = [];
  console.log('adding task - controller', task);

  try {
    const addedTaskId = await taskService.add(task);
    const addedTask = await taskService.getById(addedTaskId.insertedId);
    res.json(addedTask);
  } catch (err) {
    logger.error('Failed to add task', err);
    res.status(500).send({ err: 'Failed to add task' });
  }
}

// UPDATE - Working!!!
async function updateTask(req, res) {
  try {
    const task = req.body;
    // console.log('updating taks', task);
    const updatedTask = await taskService.update(task);
    res.json(updatedTask);
  } catch (err) {
    logger.error('Failed to update task', err);
    res.status(500).send({ err: 'Failed to update task' });
  }
}

// DELETE - Working !!!!
async function removeTask(req, res) {
  try {
    const { id } = req.params;
    const removedId = await taskService.remove(id);
    res.status(200).send(removedId);
  } catch (err) {
    logger.error('Failed to remove task', err);
    res.status(500).send({ err: 'Failed to remove task' });
  }
}
