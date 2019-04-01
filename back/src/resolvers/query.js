async function articles(root, args, context, info) {
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

async function article(root, args, context, info) {
  return await context.prisma.article({
    id: args.id
  })
}

module.exports = {
  articles,
  article,
}
