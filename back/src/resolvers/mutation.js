const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET,
        ADMIN_USER,
        currentDateString,
        getUserId,
        assertAdminUser } = require('../utils');

async function signup(parent, args, context, info) {
  const exists = await context.prisma.$exists.user({
    name: args.name
  });

  if (exists) {
    throw new Error('User already exists');
  }

  const pwHash = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({
    name: args.name,
    email: args.email,
    pwHash: pwHash,
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.pwHash);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function postArticle(parent, args, context, info) {
  await assertAdminUser(context);

  const timestamp = currentDateString();

  return await context.prisma.createArticle({
    draft: true,
    title: args.title,
    summary: args.summary,
    content: args.content,
    tags: { set: args.tags },
    modifiedAt: timestamp
  });
}

async function updateArticle(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.updateArticle({
    data: {
      title: args.title,
      summary: args.summary,
      content: args.content,
      tags: { set: args.tags },
    },
    where: {
      id: args.id
    }
  });
}

async function publishArticle(parent, args, context, info) {
  await assertAdminUser(context);

  const timestamp = currentDateString();

  let data = {
    draft: !args.publish,
    modifiedAt: timestamp
  };

  if (args.publish) {
    data.publishedAt = timestamp
  };

  return await context.prisma.updateArticle({
    data,
    where: {
      id: args.id
    }
  });
}

async function deleteArticle(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.deleteArticle({
    id: args.id
  });
}

async function postPage(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.createPage({
    name: args.name,
    content: args.content,
  });
}

async function updatePage(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.updatePage({
    data: {
      content: args.content,
    },
    where: {
      name: args.name
    }
  });
}

async function deletePage(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.deletePage({
    name: args.name
  });
}

async function postComment(parent, args, context, info) {
  const userId = getUserId(context);

  return await context.prisma.createComment({
    content: args.content,
    user: { connect: { id: userId } },
    article: { connect: { id: args.articleId } },
  });
}

async function deleteComment(parent, args, context) {
  const userId = getUserId(context);

  const user = await context.prisma.user({ id: userId });
  const comment = await context.prisma.comment({ id: args.commentId });

  if (comment) {
    if (user.name != ADMIN_USER && user.id != comment.user().id) {
      throw new Error("Not authorized");
    }

    return await context.prisma.deleteComment({ id: args.commentId });
  }
}

module.exports = {
  signup,
  login,
  postPage,
  updatePage,
  deletePage,
  postArticle,
  updateArticle,
  publishArticle,
  deleteArticle,
  postComment,
  deleteComment,
};
