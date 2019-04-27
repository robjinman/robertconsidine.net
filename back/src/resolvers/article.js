function comments(parent, args, context) {
  return context.prisma.article({ id: parent.id }).comments(
    {
      orderBy: 'createdAt_DESC'
    }
  );
}

function files(parent, args, context) {
  return context.prisma.article({ id: parent.id }).files();
}

module.exports = {
  comments,
  files
};
