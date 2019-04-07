const jwt = require('jsonwebtoken')
const APP_SECRET = 'MyAppSecret123'
const ADMIN_USER = 'rob'

function currentDateString() {
  return (new Date()).toISOString();
}

function getUserId(context) {
  const authorization = context.request.get('Authorization')
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)

    return userId
  }

  throw new Error('Not authenticated')
}

async function assertAdminUser(context) {
  const userId = getUserId(context)
  const user = await context.prisma.user({ id: userId })

  if (user.name != ADMIN_USER) {
    throw new Error("Not authorized")
  }
}

module.exports = {
  APP_SECRET,
  ADMIN_USER,
  getUserId,
  assertAdminUser,
  currentDateString
}
