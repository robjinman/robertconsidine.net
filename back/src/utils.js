const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;
const ADMIN_USER = 'rob';

function currentDateString() {
  return (new Date()).toISOString();
}

function getUserId(context) {
  const authorization = context.request.get('Authorization');
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);

    return userId;
  }

  return null;
}

async function assertAdminUser(context) {
  const userId = getUserId(context);
  const user = await context.prisma.user({ id: userId });

  if (user.name != ADMIN_USER) {
    throw new Error("Not authorized");
  }
}

function lowerCase(s) {
  return s === null ? null : s.toLowerCase();
}

module.exports = {
  APP_SECRET,
  ADMIN_USER,
  getUserId,
  assertAdminUser,
  currentDateString,
  lowerCase
};
