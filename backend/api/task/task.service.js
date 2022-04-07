const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};

async function performTask(task) {
  try {
    // TODO: update task status to running and save to DB
    // TODO: execute the task using: externalService.execute
    // TODO: update task for success (doneAt, status)
  } catch (error) {
    // TODO: update task for error: status, errors
  } finally {
    // TODO: update task lastTried, triesCount and save to DB
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

function _buildCriteria(filterBy) {
  const criteria = {};

  if (filterBy._id) {
    criteria.hostId = { $eq: filterBy._id };
  }


  return criteria;
}
