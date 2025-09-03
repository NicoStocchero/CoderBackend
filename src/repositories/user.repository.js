import { mongooseSchema as User } from "../models/user.model.js";

/**
 * Repository de Usuarios
 */
class UserRepository {
  constructor(model) {
    this.model = model;
  }

  find(filter = {}) {
    return this.model.find(filter);
  }

  findById(id) {
    return this.model.findById(id);
  }

  findOne(filter) {
    return this.model.findOne(filter);
  }

  create(data) {
    return this.model.create(data);
  }

  findByIdAndUpdate(id, updates, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, updates, options);
  }

  findByIdAndDelete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository(User);
export default userRepository;
