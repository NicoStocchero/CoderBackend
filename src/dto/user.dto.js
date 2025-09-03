/**
 * DTO de Usuario para exponer datos no sensibles
 * @param {Object} user - Documento/objeto de usuario
 * @returns {Object} - Usuario seguro para respuestas
 */
export class UserDTO {
  constructor(user) {
    const plain = user?.toObject ? user.toObject() : user || {};
    this._id = plain._id;
    this.first_name = plain.first_name;
    this.last_name = plain.last_name;
    this.email = plain.email;
    this.role = plain.role || "user";
    this.cart = plain.cart || null;
    this.createdAt = plain.createdAt || null;
  }
}

export default UserDTO;
