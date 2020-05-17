const bcrypt = require("bcryptjs")
const { transporter, emailTemplate } = require("../utils")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)


const createCompany = async (_, args, context) => {
  // if (await context.prisma.user({ email: args.emailUser })) throw new Error("User already exists")

  let randomPassword = Math.random().toString(36).substring(5)

  const mailOptions = {
    from: "madu.group7@gmail.com",
    to: args.emailUser,
    subject: "Votre mot de passe",
    html: emailTemplate(`${args.firstNameUser} ${args.lastNameUser}`, randomPassword),
  }

  const hashPassword = await bcrypt.hash(randomPassword, 10)

  const representativeUser = (
    await context.prisma.user({ email: args.emailUser })
  ) || (
    await context.prisma.createUser({
      firstName: args.firstNameUser,
      lastName: args.lastNameUser,
      email: args.emailUser,
      password: hashPassword,
      phone: args.phoneUser,
      role: args.roleUser,
      isRepresentative: args.isRepresentative,
    })
  )

  const stripeCustomer = await stripe.customers.create({
    name: args.companyName,
    email: args.emailUser,
  })

  const company = await context.prisma.createCompany({
    name: args.companyName,
    type: args.companyType,
    address: {
      create: {
        street: args.streetCompany,
        zipCode: args.zipCodeCompany,
        city: args.cityCompany,
      },
    },
    users: { connect: [ { id: representativeUser.id } ] },
    emailDomains: {
      set: args.emailDomains,
    },
    stripeCustomerId: stripeCustomer.id,
  })
  // console.log(transporter)
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })

  return {
    ...company,
    userCount: 1,
    representativeUser,
    stripeInvoices: [],
  }
}

const setCompanyChallenges = async (_, { id }, context) => {
  const curChallenges = (await context.prisma.company({ id }).challenges())
    .map(el => ({id: el.id }))
  const newChallenges = (await context.prisma.challenges())
    .sort(() => Math.random() - 0.5)
    .reduce((acc, cur) => {
      if(acc.length < 3 && !curChallenges.find(c => c.id === cur.id)) acc.push({ id: cur.id })
      return acc
    }, [])

  //empty users validated challenges
  const users = await context.prisma.company({ id }).users()
  users.forEach(await async function ({id}) {
    const ids = (await context.prisma.user({ id }).validatedChallenges()).map(c => ({ id: c.id }))
    await context.prisma.updateUser({
      where: { id },
      data: { validatedChallenges: { disconnect: ids }},
    })
  })

  return await context.prisma.updateCompany({
    where: { id },
    data: { challenges: {
      disconnect: curChallenges,
      connect: newChallenges,
    }},
  })
}

module.exports = {
  queries: {
    getCompanies(_, args, context) {
      return context.prisma.companies()
    },
    getCompany(_, { id }, context) {
      return context.prisma.company({ id })
    },
  },
  mutations: {

    createCompany,

    createCompanies (_, { companies }, context) {
      return Promise.all(companies.map(company => createCompany(_, company, context)))
    },

    updateCompany(_, { companyId, name, type, street, zipCode, city, emailDomains }, context) {
      return context.prisma.updateCompany({
        where: { id: companyId },
        data: {
          name,
          type,
          address: {
            update: { street, zipCode, city },
          },
          emailDomains: { set: emailDomains },
        },
      })
    },

    deleteCompany(_, { id }, context) {
      return context.prisma.deleteCompany({ id })
    },

    setCompanyChallenges,

    async setAllCompaniesChallenges(parent, args, context) {
      const ids = (await context.prisma.companies()).map(c => c.id)
      return await Promise.all(ids.map(async id => await setCompanyChallenges(parent, { id }, context)))
    },
  },
  resolvers: {
    Company: {
      users (parent, args, context) {
        return context.prisma.company({ id: parent.id }).users()
      },

      userCount ({ id }, args, context) {
        return context.prisma.usersConnection({ where: { company: { id } } }).aggregate().count()
      },

      async representativeUser ({ id }, _, { prisma }) {
        const [ user ] = await prisma.company({ id }).users({ where: { isRepresentative: true } })
        return user
      },

      async stripeInvoices ({ stripeCustomerId }, args, context) {
        const { data } = await stripe.invoices.list({ customer: stripeCustomerId })
        return data
      },

      challenges (parent, args, context) {
        return context.prisma.company({ id: parent.id }).challenges()
      },
    },
  },
}