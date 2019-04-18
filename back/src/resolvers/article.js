function comments(parent, args, context) {
  return context.prisma.article({ id: parent.id }).comments();
}

function files(parent, args, context) {
  return context.prisma.article({ id: parent.id }).files();
}

module.exports = {
  comments,
  files
};
