import crypto from "crypto";

class UserManager {
  static users = [];
  static #salt = crypto.randomBytes(16);

  static createUser(userObject) {
    const { firstName, lastName, email, password } = userObject;

    if (UserManager.users.find((user) => user.email === email)) {
      console.error("User already exists with this email.");
      return;
    }

    const hash = UserManager.#createHash(password);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hash,
    };

    UserManager.users.push(newUser);
    return console.log("User created successfully:", newUser);
  }

  static getUser() {
    return console.log("Users:", UserManager.users);
  }

  static login(email, password) {
    const userFounded = UserManager.users.find((user) => user.email === email);
    if (!userFounded) {
      console.error("User not found.");
      return;
    }
    const result = UserManager.#validatePassword(password, userFounded);
    console.log(result);
  }

  static #createHash(password) {
    const digest = "sha3-256";
    const hash = crypto.pbkdf2Sync(password, UserManager.#salt, 50, 64, digest);
    return hash.toString("hex");
  }

  static #validatePassword(password, user) {
    const digest = "sha3-256";
    const hash = crypto
      .pbkdf2Sync(password, UserManager.#salt, 50, 64, digest)
      .toString("hex");

    return hash === user.password
      ? console.log("Password is valid.")
      : console.error("Invalid password.");
  }
}

UserManager.createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "securepassword1@23",
});

UserManager.login("john.doe@example.com", "securepassword1@23");
