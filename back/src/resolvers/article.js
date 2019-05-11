const { getUserId } = require("../utils");

function comments(parent, args, context) {
  const userId = getUserId(context);

  return context.prisma.article({ id: parent.id }).comments(
    {
      orderBy: 'createdAt_DESC',
      where: {
        OR: [
          {
            user: {
              activationCode: null
            }
          },
          {
            user: null
          },
          {
            user: {
              id: userId
            }
          }
        ]
      }
    }
  );
}

function files(parent, args, context) {
  return context.prisma.article({ id: parent.id }).files();
}

function tags(parent, args, context) {
  return context.prisma.article({ id: parent.id }).tags();
}

module.exports = {
  comments,
  files,
  tags
};
