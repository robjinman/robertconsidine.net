function comments(parent, args, context) {
  return context.prisma.article({ id: parent.id }).comments();
}

module.exports = {
  comments,
};
