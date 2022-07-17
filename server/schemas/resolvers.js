const { User } = require("../models")
const { AuthenticationError } = require("apollo-server-express")
const { signToken } = require("../utils/auth");


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                return userData
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const newUser = await User.create(args);
            const token = signToken(newUser)
            return { token, newUser }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })
            if (!user) {
                throw new AuthenticationError("This email is not in our database")
            }
            const validPassword = await user.isCorrectPassword(password)
            if (!validPassword) {
                throw new AuthenticationError("Password is incorrect")
            }
            const token = signToken(user)
            return { token, user }
        },
        saveBook: async (parent, args, context) => {
            console.log(args.input)
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true, runValidators: true }
                )
                console.log(user)
                return user
            }
            throw new AuthenticationError("User must be logged in to use this feature!")
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return user
            }
            throw new AuthenticationError("User must be logged in to use this feature!")
        }
    }
};

module.exports = resolvers;