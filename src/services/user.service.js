import userRepository from "../repositories/user.repository.js";

/**
 * Servicio de Usuarios
 */
class UserService {
  findAll() {
    return userRepository.find().lean();
  }

  getById(id) {
    return userRepository.findById(id);
  }

  getByEmail(email) {
    return userRepository.findOne({ email });
  }

  create(data) {
    return userRepository.create(data);
  }

  update(id, updates) {
    return userRepository.findByIdAndUpdate(id, updates, { new: true });
  }

  delete(id) {
    return userRepository.findByIdAndDelete(id);
  }
}

export const userService = new UserService();
export default userService;
