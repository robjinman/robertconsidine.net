async function document(parent, args, context) {
  let file = context.prisma.file({ id: parent.id });
  let article = await file.article();
  if (article) {
    return article;
  }
  return await file.page();
}

module.exports = {
  document
};
