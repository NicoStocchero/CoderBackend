import fs from "fs";

class UserManager {
  static async createUser(userObj) {
    const { firstName, lastName, age, course } = userObj;
    const users = await UserManager.getUsers();

    users.push({
      firstName,
      lastName,
      age,
      course,
      id: users.length + 1,
    });

    const json = JSON.stringify(users, null, 2);

    await fs.promises.writeFile("./users.json", json);

    console.log("User created successfully:", userObj);
  }

  static async getUsers() {
    try {
      const json = await fs.promises.readFile("./users.json");
      return JSON.parse(json);
    } catch (error) {
      await fs.promises.writeFile("./users.json", JSON.stringify([]));
      return [];
    }
  }
}

const main = async () => {
  try {
    await UserManager.createUser({
      firstName: "Jane",
      lastName: "Doe",
      age: 25,
      course: "Python",
    });
    await UserManager.createUser({
      firstName: "John",
      lastName: "Smith",
      age: 30,
      course: "JavaScript",
    });
    await UserManager.createUser({
      firstName: "Alice",
      lastName: "Johnson",
      age: 28,
      course: "Java",
    });
    await UserManager.createUser({
      firstName: "Bob",
      lastName: "Brown",
      age: 22,
      course: "C++",
    });
    await UserManager.createUser({
      firstName: "Charlie",
      lastName: "Davis",
      age: 35,
      course: "Ruby",
    });
    await UserManager.createUser({
      firstName: "Eve",
      lastName: "White",
      age: 29,
      course: "Go",
    });
    await UserManager.createUser({
      firstName: "Frank",
      lastName: "Black",
      age: 32,
      course: "PHP",
    });

    const users = await UserManager.getUsers();
    console.log("Current users:", users);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
