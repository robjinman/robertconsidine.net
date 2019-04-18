function files(parent, args, context) {
  return context.prisma.page({ id: parent.id }).files();
}

module.exports = {
  files
};
