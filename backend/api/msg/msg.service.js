const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
  query,
  queryAll,
  addMsg,
  addChat,
  updateLastSeen,
  // remove,
}

async function query(topic) {
  var reverseTopic = topic.topic.split('-').reverse().join('-');
  const collection = await dbService.getCollection('msg');
  var chat = await collection.find({ $or: [{ topic: { $eq: topic.topic } }, { topic: { $eq: reverseTopic } }] }).toArray();
  // console.log('msg service query find chat:', chat);
  if (!chat.length) {
    // console.log('msg service query add:');
    return await addChat(topic.topic);
  }
  return chat[0]
}

async function queryAll(userId) {
  const collection = await dbService.getCollection('msg');
  // console.log('service all userId:', typeof userId);
  var id = new ObjectId(userId);
  // console.log('user mongo id', id);
  var chats = await collection.find({ $or: [{ "user1._id": { $eq: id } }, { "user2._id": { $eq: id } }] }).toArray();
  // console.log('msg service query find chats:', chats);
  return chats
}

async function addChat(topic) {
  const usersId = topic.split('-')
  const user1 = await userService.getById(usersId[0])
  const user2 = await userService.getById(usersId[1])
  var chat = {
    topic: topic,
    user1: {
      _id: user1._id,
      fullname: user1.fullname,
      imgUrl: user1.imgUrl,
      lastSeenMsg: '',
    },
    user2: {
      _id: user2._id,
      fullname: user2.fullname,
      imgUrl: user2.imgUrl,
      lastSeenMsg: '',
    },
    msgs: [],
  }

  const collection = await dbService.getCollection('msg')
  const addedChat = await collection.insertOne(chat)
  chat._id = addedChat.insertedId
  // console.log('48', chat);
  return chat
}

async function getById(chatId) {
  try {
    const collection = await dbService.getCollection('msg')
    const chat = collection.findOne({ _id: ObjectId(chatId) })
    return chat
  } catch (err) {
    logger.error(`while finding chat ${chatId}`, err)
    throw err
  }
}

async function addMsg(msg, topic) {
  const collection = await dbService.getCollection('msg')
  msg._id = new ObjectId()
  const addedMsg = await collection.update({ "topic": topic }, { $push: { "msgs": msg } })
  return msg
}

async function updateLastSeen(userId, topic) {
  try {
    // console.log('service update 1', userId, topic);
    const collection = await dbService.getCollection('msg')
    var chat = await collection.find({ topic: { $eq: topic } }).toArray();
    // console.log('service update 2 chat:', chat[0]);

    const users = [chat[0].user1, chat[0].user2]
    // console.log('service update 3 users:', users);

    const userNum = users.findIndex(user => user._id.toString() === userId) + 1;
    // console.log('service update 4 userNum:', chat[0].msgs[chat[0].msgs.length - 1]._id);

    chat[0][`user${userNum}`].lastSeenMsg = chat[0].msgs[chat[0].msgs.length - 1]._id
    // console.log('new chat:', chat[0]);
    await collection.replaceOne({ topic: { $eq: topic } }, { topic: chat[0].topic, _id: chat[0]._id, user1: chat[0].user1, user2: chat[0].user2, msgs: chat[0].msgs })
    return chat[0]
  } catch (err) {
    logger.error(`while finding chat ${topic}`, err)
    throw err
  }
}

// async function remove(msgId) {
//   try {
//     console.log(msgId);
//     const collection = await dbService.getCollection('msgs')
//     const criteria = { _id: ObjectId(msgId) }
//     await collection.deleteOne(criteria)
//   } catch (err) {
//     logger.error(`cannot remove msg ${msgId}`, err)
//     throw err
//   }
// }

function _buildCriteria(filterBy) {
  if (filterBy.userId) {
    return { userId: ObjectId(filterBy.userId) }
  } else if (filterBy.toyId) {
    return { toyId: ObjectId(filterBy.toyId) }
  }
  return {}
}
