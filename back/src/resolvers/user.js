function comments(parent, args, context) {
  return context.prisma.user({ id: parent.id }).comments();
}

function activated(parent, args, context) {
  return context.prisma.user({ id: parent.id }).activationCode != null;
}

module.exports = {
  comments,
  activated
};
