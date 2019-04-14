const { assertAdminUser } = require('../utils');

async function publishedArticles(root, args, context, info) {
  let where = {
    draft: false
  };

  if (args.filter) {
    where.OR = [
      { title_contains: args.filter },
      { summary_contains: args.filter },
    ];
  };

  return await context.prisma.articles({
    where,
    skip: args.skip,
    first: args.first,
  });
}

async function allArticles(root, args, context, info) {
  return await context.prisma.articles({
    skip: args.skip,
    first: args.first,
  });
}

async function article(root, args, context, info) {
  let article = await context.prisma.article({
    id: args.id
  });

  if (article.draft) {
    await assertAdminUser(context);
  }

  return article;
}

async function page(root, args, context, info) {
  return await context.prisma.page({
    name: args.name
  });
}

module.exports = {
  publishedArticles,
  allArticles,
  article,
  page
};
