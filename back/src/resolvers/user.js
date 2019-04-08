function comments(parent, args, context) {
  return context.prisma.user({ id: parent.id }).comments();
}

module.exports = {
  comments,
};
