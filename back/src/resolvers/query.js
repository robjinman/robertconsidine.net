const { assertAdminUser, getUserId, ADMIN_USER } = require("../utils");

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

  if (args.tags) {
    where.tags_some = {
      id_in: args.tags
    }
  }

  return await context.prisma.articles({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: 'publishedAt_DESC'
  });
}

async function allArticles(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.articles({
    skip: args.skip,
    first: args.first,
    orderBy: 'createdAt_DESC'
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

async function tag(root, args, context, info) {
  return await context.prisma.tag({
    id: args.id
  });
}

async function usedTags(root, args, context, info) {
  return await context.prisma.tags({
    where: {
      articles_some: {
        id_not: null
      }
    }
  });
}

async function allTags(root, args, context, info) {
  return await context.prisma.tags();
}

async function comments(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.comments({
    skip: args.skip,
    first: args.first,
    orderBy: 'createdAt_DESC'
  });
}

async function page(root, args, context, info) {
  return await context.prisma.page({
    name: args.name
  });
}

async function pages(root, args, context, info) {
  return await context.prisma.pages();
}

async function files(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.files({
    where: {
      OR: [
        {
          page: {
            id: args.documentId
          },
        },
        {
          article: {
            id: args.documentId
          }
        }
      ]
    }
  });
}

async function users(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.users({
    skip: args.skip,
    first: args.first
  });
}

async function user(root, args, context, info) {
  const userId = getUserId(context);
  const user = await context.prisma.user({ id: userId });

  if (user.name != ADMIN_USER && user.name != args.name) {
    throw new Error("Not authorized");
  }

  return user;
}

module.exports = {
  publishedArticles,
  allArticles,
  article,
  tag,
  allTags,
  usedTags,
  comments,
  page,
  pages,
  files,
  users,
  user
};
