function newArticleSubscribe(parent, args, context, info) {
  return context.prisma.$subscribe.article({ mutation_in: ['CREATED'] }).node()
}

const newArticle = {
  subscribe: newArticleSubscribe,
  resolve: payload => {
    return payload
  },
}

module.exports = {
  newArticle,
}
