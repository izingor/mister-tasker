const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getMsgs, addMsg,getChat,getAllChats,updateLastSeen } = require('./msg.controller')
const router = express.Router()

router.get('/', getAllChats)
router.get('/:topic', getChat)
router.post('/', addMsg)
router.put('/', updateLastSeen)



module.exports = router
