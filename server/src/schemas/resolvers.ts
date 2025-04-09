import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = { 
  Query: {
    // This query retrieves the current user's information
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      const foundUser = await User.findById(context.user._id);

      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }

      return foundUser;
    },
  },

  Mutation: {
    // This mutation is used to add a new user
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Something is wrong!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // This mutation is used to log in a user
    login: async (_parent: any, { username, email, password }: { username?: string; email?: string; password: string }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // This mutation is used to save a book
    saveBook: async (_parent: any, { book }: { book: any }, context: any) => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
    // This mutation is used to remove a book
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};