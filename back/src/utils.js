const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { prisma } = require("./generated/prisma-client");

const APP_SECRET = process.env.APP_SECRET;
const INITIAL_ADMIN_PASSWORD = 'admin1234';
const INITIAL_ADMIN_EMAIL = 'dummy@email.com';
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

async function createAdminUser() {
  const exists = await prisma.$exists.user({
    name: ADMIN_USER
  });

  if (!exists) {
    const pwHash = await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 10);
    await prisma.createUser({
      name: ADMIN_USER,
      email: INITIAL_ADMIN_EMAIL,
      pwHash: pwHash,
      activationCode: null
    });
  }
}

async function assertAdminUser(context) {
  const userId = getUserId(context);
  if (userId === null) {
    throw new Error("Not authorized");
  }

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
  createAdminUser,
  assertAdminUser,
  currentDateString,
  lowerCase
};
