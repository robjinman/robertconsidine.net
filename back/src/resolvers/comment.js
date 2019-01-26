function user(parent, args, context) {
  return context.prisma.comment({ id: parent.id }).user()
}

function article(parent, args, context) {
  return context.prisma.comment({ id: parent.id }).article()
}

module.exports = {
  user,
  article,
}
