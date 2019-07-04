const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
const { APP_SECRET,
        ADMIN_USER,
        EMAIL_ADDRESS,
        currentDateString,
        getUserId,
        assertAdminUser,
        lowerCase } = require("../utils");
const captcha = require("../captcha");
const activation = require("../account_activation");

async function signup(parent, args, context, info) {
  await captcha.verifyCaptcha(args.captcha);

  const email = lowerCase(args.email);

  const exists = await context.prisma.$exists.user({
    OR: [
      {
        name: args.name
      }, {
        email
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
    email: email,
    pwHash: pwHash,
    activationCode: code
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  activation.dispatchActivationEmail(user.id, args.name, email, code);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const email = lowerCase(args.email);
  const user = await context.prisma.user({ email: email });
  if (!user) {
    throw new Error("No such user found");
  }

  // Don't allow admin login through this endpoint
  if (user.name === ADMIN_USER) {
    throw new Error("Not authorised");
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

async function adminLogin(parent, args, context, info) {
  await captcha.verifyCaptcha(args.captcha);

  const email = lowerCase(args.email);
  const user = await context.prisma.user({ email: email });
  if (!user) {
    throw new Error("No such user found");
  }

  if (user.name !== ADMIN_USER) {
    throw new Error("Not authorised");
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

async function sendActivationEmail(parent, args, context, info) {
  const userId = getUserId(context);

  const user = await context.prisma.user({
    id: userId
  });

  if (user.activationCode === null) {
    throw new Error("User already activated");
  }

  activation.dispatchActivationEmail(user.id,
                                     user.name,
                                     user.email,
                                     user.activationCode);
}

async function activateAccount(parent, args, context, info) {
  const users = await context.prisma.updateManyUsers({
    data: {
      activationCode: null
    },
    where: {
      AND: [{
        id: args.id,
      }, {
        activationCode: args.code,
      }]
    }
  });

  if (users.count == 0) {
    throw new Error("No user with matching id and activation code");
  }

  return true;
}

async function postArticle(parent, args, context, info) {
  await assertAdminUser(context);

  const timestamp = currentDateString();

  return await context.prisma.createArticle({
    draft: true,
    title: args.title,
    summary: args.summary,
    content: args.content,
    tags: { connect: args.tags.map(id => { return { id }; }) },
    modifiedAt: timestamp
  });
}

async function updateArticle(parent, args, context, info) {
  await assertAdminUser(context);

  const currentTags = (await context.prisma.article({
    id: args.id
  }).tags()).map(t => t.id);

  const tagSet = new Set(args.tags);
  const toRemove = currentTags.filter(t => !tagSet.has(t));

  return await context.prisma.updateArticle({
    data: {
      title: args.title,
      summary: args.summary,
      content: args.content,
      tags: {
        disconnect: toRemove.map(id => { return { id }; }),
        connect: args.tags.map(id => { return { id }; })
      },
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

async function postTag(parent, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.createTag({
    name: args.name
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

async function updateUser(parent, args, context, info) {
  const userId = getUserId(context);

  if (userId !== args.id) {
    throw new Error("Not authorized");
  }

  const user = await context.prisma.user({ id: userId });
  const valid = await bcrypt.compare(args.currentPw, user.pwHash);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const pwHash = await bcrypt.hash(args.newPw, 10);

  return await context.prisma.updateUser({
    data: {
      name: args.name,
      email: args.email,
      pwHash: pwHash
    },
    where: {
      id: userId
    }
  });
}

async function deleteUser(parent, args, context, info) {
  await assertAdminUser(context);

  const user = context.prisma.user({
    id: args.id
  });

  if (user.activationCode) {
    await context.prisma.deleteManyComments({
      user: {
        id: args.id
      }
    });
  }

  return await context.prisma.deleteUser({
    id: args.id
  });
}

async function sendEmail(parent, args, context, info) {
  await captcha.verifyCaptcha(args.captcha);

  const admin = await context.prisma.user({
    name: ADMIN_USER
  });

  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const options = {
    from: args.email,
    to: admin.email,
    subject: `(via robjinman.com) ${args.subject}`,
    text: `From ${args.email}\n\n${args.message}`
  };

  transporter.sendMail(options, error => {
    if (error) {
      console.error("Failed to send email", error);
      throw new Error("Failed to send email");
    }
  });

  return true;
}

module.exports = {
  signup,
  login,
  activateAccount,
  sendActivationEmail,
  adminLogin,
  postPage,
  updatePage,
  deletePage,
  postArticle,
  updateArticle,
  publishArticle,
  deleteArticle,
  postTag,
  postComment,
  deleteComment,
  uploadFile,
  deleteFile,
  updateUser,
  deleteUser,
  sendEmail
};
