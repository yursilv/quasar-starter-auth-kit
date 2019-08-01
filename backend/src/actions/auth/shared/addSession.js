const SessionDAO = require('../../../dao/SessionDAO')
const SessionEntity = require('../../../entities/SessionEntity')

const MAX_SESSIONS_COUNT = 5

module.exports = async session => {
  if (!(session instanceof SessionEntity)) {
    throw new Error('Wrong SessionEntity')
  }

  if (await _isValidSessionsCount(session.userId)) {
    await _addSession(session)
  } else {
    await _wipeAllUserSessions(session.userId)
    await _addSession(session)
  }
}

async function _isValidSessionsCount (userId) {
  const existingSessionsCount = await SessionDAO.baseGetCount({ userId })
  return existingSessionsCount < MAX_SESSIONS_COUNT
}

async function _addSession (session) {
  // for better performance store sessions in Redis persistence
  await SessionDAO.create(session)
}

async function _wipeAllUserSessions (userId) {
  return await SessionDAO.baseRemoveWhere({ userId })
}
