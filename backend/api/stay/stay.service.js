const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('stay')
    var stays = await collection.find(criteria).toArray()
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    const stay = collection.findOne({ _id: ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.deleteOne({ _id: ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay')
    const addedStay = await collection.insertOne(stay)
    return addedStay
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}

async function update(stay) {
  try {
    var id = ObjectId(stay._id)
    delete stay._id
    const collection = await dbService.getCollection('stay')
    await collection.updateOne({ _id: id }, { $set: { ...stay } })
    return stay
  } catch (err) {
    logger.error(`cannot update stay ${stay._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.destination) {
    const regex = new RegExp(filterBy.destination, 'i');
    criteria["loc.city"] = { $regex: regex }
  }
  if (filterBy.guests) {
    criteria.capacity = { $gte: +filterBy.guests }
  }
  if (filterBy.amenities) {
    criteria.amenities = { $all: (filterBy.amenities) }
  }
  if (filterBy.maxPrice && filterBy.minPrice) {
    criteria.price = { $lte: JSON.parse(filterBy.maxPrice), $gte: JSON.parse(filterBy.minPrice) }
  }

  return criteria
}
