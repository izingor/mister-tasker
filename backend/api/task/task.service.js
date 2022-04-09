const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  performTask,
  getNextTask
};

async function performTask(task) {
  const id = ObjectId(task._id);
  const collection = await dbService.getCollection('task');
  try {
    task.status = 'running';
    delete task._id;
    await collection.updateOne({ _id: id }, { $set: { ...task } });
    await execute(task);
    task.status = 'done';
    task.doneAt = Date.now();
  } catch (error) {
    task.status = 'failed';
    task.errors.push(error);
  } finally {
    task.lastTriedAt = Date.now();
    task.triesCount++;
    await collection.updateOne({ _id: id }, { $set: { ...task } });
    task._id = id;
    return task;
  }
}

async function execute(task) {
  console.log('executing the task');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {

        console.log('success');
        resolve(parseInt(Math.random() * 100));
      }
      // TODO: throw some more random errors like in the image above
      else {
        console.log('fail');

        reject('High Temparture');
      }

    }, 5);
  });
}

async function query(filterBy = {}) {
  try {
    // const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection('task');
    var tasks = await collection.find().toArray();
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
//add tast - working!!!
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

async function getNextTask() {
  try {
    const collection = await dbService.getCollection('task');
    var task = await collection.find({
      $and:
        [{ triesCount: { $lt: 5 } },
        {
          $or: [{ status: { $eq: 'new' } },
          { status: { $eq: 'failed' } }]
        }]
    })
      .sort({ triesCount: 1, importance: -1, _id: 1 }).limit(1);
    return task;
  } catch (err) {
    logger.error('cannot find task to run', err);
    throw err;
  }
}
