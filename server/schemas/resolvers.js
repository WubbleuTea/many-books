const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


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
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        //this might be wrong
        const addBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }
        );
    
        return addBook;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
                //this might be wrong
        const deleteBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId: bookId }}},
          { new: true }
        );
    
        return deleteBook;
      }

    }
  }
};

module.exports = resolvers;