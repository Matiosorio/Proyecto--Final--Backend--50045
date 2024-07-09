const UserModel = require("../models/user.model.js");

class UserRepository {
    async createUser(userData) {
        try {
            const newUser = new UserModel(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error("Error al crear usuario en la base de datos");
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al encontrar usuario por email");
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users.map(user => user.toObject());
      }


    async deleteUser(uid) {
        try {
            await UserModel.findByIdAndDelete(uid);
        } catch (error) {
            throw new Error("Error al eliminar el usuario");
        }
    }

    async deleteInactiveUsers() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        try {
            const inactiveUsers = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });
            const result = await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });

            return { deletedCount: result.deletedCount, deletedUsers: inactiveUsers };
        } catch (error) {
            throw new Error("Error al eliminar usuarios inactivos");
        }
    }
}

module.exports = UserRepository;
