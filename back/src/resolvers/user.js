function comments(parent, args, context) {
  return context.prisma.user({ id: parent.id }).comments();
}

async function activated(parent, args, context) {
  let user = await context.prisma.user({ id: parent.id });
  return user.activationCode == null;
}

module.exports = {
  comments,
  activated
};
