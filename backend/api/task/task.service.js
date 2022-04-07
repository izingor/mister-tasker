const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  performTask
};

async function performTask(task) {
  try {
    const collection = await dbService.getCollection('task');
    // update task status to running and save to DB
    task.status = 'running'
    const id = ObjectId(task._id);
    delete task._id;
    await collection.updateOne({ _id: id }, { $set: { ...task } });
    //  execute the task using: externalService.execute
    await execute(task)
    // update task for success (doneAt, status)
    task.status = 'done'
  } catch (error) {
    // update task for error: status, errors
    task.status = 'failed'
    task.errors.push(error);
  } finally {
    // update task lastTried, triesCount and save to DB
    task.lastTriedAt = Date.now();
    task.triesCount++
    await collection.updateOne({ _id: id }, { $set: { ...task } });
    task._id = id;
    return task
  }
}

function execute(task) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) resolve(parseInt(Math.random() * 100))
      // TODO: throw some more random errors like in the image above
      else reject('High Temparture');
    }, 5000)
  })
}

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection('task');
    var tasks = await collection.find(criteria).toArray();
    return tasks;
  } catch (err) {
    logger.error('cannot find tasks', err);
    throw err;
  }
}

async function getById(taskId) {
  try {
    const collection = await dbService.getCollection('task');
    const task = collection.findOne({ _id: ObjectId(taskId) });
    return task;
  } catch (err) {
    logger.error(`while finding task ${taskId}`, err);
    throw err;
  }
}

async function remove(taskId) {
  try {
    const collection = await dbService.getCollection('task');
    await collection.deleteOne({ _id: ObjectId(taskId) });
    return taskId;
  } catch (err) {
    logger.error(`cannot remove task ${taskId}`, err);
    throw err;
  }
}

async function add(task) {
  try {
    const collection = await dbService.getCollection('task');
    const addedTask = await collection.insertOne(task);
    return addedTask;
  } catch (err) {
    logger.error('cannot insert task', err);
    throw err;
  }
}

async function update(task) {
  try {
    var id = ObjectId(task._id);
    delete task._id;
    const collection = await dbService.getCollection('task');
    await collection.updateOne({ _id: id }, { $set: { ...task } });
    task._id = id;
    return task;
  } catch (err) {
    logger.error(`cannot update task ${task._id}`, err);
    throw err;
  }
}

// function _buildCriteria(filterBy) {
//   const criteria = {};

//   if (filterBy._id) {
//     criteria.hostId = { $eq: filterBy._id };
//   }


//   return criteria;
// }

async function runWorker() {
  // The isWorkerOn is toggled by the button: "Start/Stop Task Worker"
  if (!isWorkerOn) return;
  var delay = 5000;
  try {
    const task = await taskService.getNextTask()
    if (task) {
      try {
        await taskService.performTask(task)
      } catch (err) {
        console.log(`Failed Task`, err)
      } finally {
        delay = 1
      }
    } else {
      console.log('Snoozing... no tasks to perform')
    }
  } catch (err) {
    console.log(`Failed getting next task to execute`, err)
  } finally {
    setTimeout(runWorker, delay)
  }
}

async function getNextTask() {
  try {
    const collection = await dbService.getCollection('task');
    var task = await collection.find({ $and: [{ triesCount: { $lt: 5 } }, { $or: [{ status: { $eq: 'new' } }, { status: { $eq: 'failed' } }] }] }).sort({ triesCount: 1, importance: -1, _id: 1 }).limit(1);
    return task
  } catch (err) {
    logger.error('cannot find task to run', err);
    throw err;
  }
}
