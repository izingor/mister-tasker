import { httpService } from './http-service';


const ENDPOINT = 'task';

export const taskService = {
  query,
  getById,
  remove,
  save,
  getEmptyTask,
  startTask,
  startAll
};

async function startTask(id) {
  return await httpService.put(`${ENDPOINT}/${id}/start`)
}

async function startAll(id) {
  return await httpService.put(`${ENDPOINT}/runworker`)
}

async function query(filterBy = {}) {
  return await httpService.get(`${ENDPOINT}` + '/', filterBy)
}

async function getById(id) {
  return await httpService.get(`${ENDPOINT}/${id}`)
}

async function remove(id) {
  return await httpService.delete(`${ENDPOINT}/${id}`)
}

async function save(task) {
  // task.status = task.status ? task.status : "Pending"
  return task._id
    ? await httpService.put(`${ENDPOINT}/${task._id}`, task)
    : await httpService.post(ENDPOINT, task)
}

async function getEmptyTask(task) {
  const buyer = await userService.getById(task.buyerId);
  const stay = await stayService.getById(task.stayId);
  return Promise.resolve({
    "hostId": task.hostId,
    "createdAt": Date.now(),
    "buyer": {
      "_id": buyer._id,
      "fullname": buyer.fullname
    },
    "totalPrice": task.totalPrice,
    "startDate": task.startDate,
    "endDate": task.endDate,
    "guests": task.guests,
    "stay": {
      "_id": stay._id,
      "name": stay.name,
      "price": stay.price
    },
    "status": "pending"
  });
}
