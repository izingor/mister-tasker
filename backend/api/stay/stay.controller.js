const logger = require('../../services/logger.service')
const stayService = require('./stay.service')

module.exports = {
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
}

// LIST
async function getStays(req, res) {
  try {
    const filterBy = req.query
    // console.log('stay ctrl filter:', filterBy);
    const stays = await stayService.query(filterBy)
    res.json(stays)
  } catch (err) {
    logger.error('Failed to get stays', err)
    res.status(500).send({ err: 'Failed to get stays' })
  }
}

// READ
async function getStayById(req, res) {
  try {
    const { id } = req.params
    const stay = await stayService.getById(id)
    res.json(stay)
  } catch (err) {
    logger.error('Failed to get stay', err)
    res.status(500).send({ err: 'Failed to get stay' })
  }
}

// CREATE
async function addStay(req, res) {
  try {
    const stay = req.body
    const user = req.session.user
    const addedStay = await stayService.add(stay)
    res.json(addedStay)
  } catch (err) {
    logger.error('Failed to add stay', err)
    res.status(500).send({ err: 'Failed to add stay' })
  }
}

// UPDATE
async function updateStay(req, res) {
  try {
    const stay = req.body
    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })
  }
}

// DELETE
async function removeStay(req, res) {
  try {
    const { id } = req.params
    const removedId = await stayService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay', err)
    res.status(500).send({ err: 'Failed to remove stay' })
  }
}
