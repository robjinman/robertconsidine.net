const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET,
        ADMIN_USER,
        currentDateString,
        getUserId,
        assertAdminUser } = require("../utils");
const captcha = require("../captcha");
const activation = require("../account_activation");

async function signup(parent, args, context, info) {
  await captcha.verifyCaptcha(args.captcha);

  const exists = await context.prisma.$exists.user({
    OR: [
      {
        name: args.name
      }, {
        email: args.email
      }
    ]
  });

  if (exists) {
    throw new Error("User with that name or email already exists");
  }

  const code = Math.random().toString(36).substring(2, 10);
  const pwHash = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({
    name: args.name,
    email: args.email,
    pwHash: pwHash,
    activationCode: code
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  activation.dispatchActivationEmail(args.name, args.email, code);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.pwHash);
  if (!valid) {
    throw new Error("Invalid password");
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
  await captcha.verifyCaptcha(args.captcha);

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
  const comment = await context.prisma.comment({ id: args.id });

  if (comment) {
    if (user.name != ADMIN_USER && user.id != comment.user().id) {
      throw new Error("Not authorized");
    }

    return await context.prisma.deleteComment({ id: args.id });
  }
}

async function uploadFile(parent, args, context, info) {
  await assertAdminUser(context);

  let file = null;
  let page = await context.prisma.page({ id: args.documentId });

  if (page) {
    file = await context.prisma.createFile({
      name: args.name,
      extension: args.extension,
      page: { connect: { id: args.documentId } },
      article: null
    });
  }
  else {
    file = await context.prisma.createFile({
      name: args.name,
      extension: args.extension,
      page: null,
      article: { connect: { id: args.documentId } }
    });
  }

  context.s3Service.upload(file.id, args.data);

  return file;
}

async function deleteFile(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.deleteFile({
    id: args.id
  });
}

async function deleteUser(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.deleteUser({
    id: args.id
  });
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
  uploadFile,
  deleteFile,
  deleteUser
};
