const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const bookSchema = require('../models/Book');


const resolvers = {
  Query: {
    me: async (parent, args) => {
      if (context.user) {
        const userData = await User.findOne({})
        .select('-__v -password')
        .populate('savedBooks');

        return userData;
      }
      throw new AuthenticationError('Not logged in')
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if(!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if(!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        //this might be wrong
        const book = await bookSchema.create({ ...args, username: context.user.username });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { bookSchema: bookSchema._id } },
          { new: true }
        );
    
        return book;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
                //this might be wrong
        const book = await bookSchema.create({ ...args, username: context.user.username });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { bookSchema: bookSchema._id } },
          { new: true }
        );
    
        return book;
      }

    }
  }
};

module.exports = resolvers;