const { assertAdminUser } = require('../utils')

async function publishedArticles(root, args, context, info) {
  const where = args.filter ? {
    OR: [
      { title_contains: args.filter },
      { summary_contains: args.filter },
    ]
  } : {}

  return await context.prisma.articles({
    where,
    skip: args.skip,
    first: args.first,
  })
}

async function allArticles(root, args, context, info) {
  return await context.prisma.articles({
    skip: args.skip,
    first: args.first,
  })
}

async function article(root, args, context, info) {
  let article = await context.prisma.article({
    id: args.id
  })

  if (article.draft) {
    await assertAdminUser(context)
  }

  return article
}

module.exports = {
  publishedArticles,
  allArticles,
  article,
}
