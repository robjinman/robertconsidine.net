function articles(parent, args, context) {
  return context.prisma.tag({ id: parent.id }).articles();
}

module.exports = {
  articles
};
