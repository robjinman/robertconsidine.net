async function processActivation(req, res, prisma) {
  try {
    await prisma.updateUser({
      data: {
        activationCode: null
      },
      where: {
        activationCode: req.params.code
      }
    });

    res.redirect('https://robjinman.com/activation-success');
  }
  catch(err) {
    res.redirect('https://robjinman.com/activation-failure');
  }
}

module.exports = {
  processActivation
};
