import fs from "fs";

fs.writeFileSync("output.txt", "Hello, World!", "utf8");

if (fs.existsSync("output.txt")) {
  let content = fs.readFileSync("output.txt", "utf8");

  console.log("File content:", content);

  fs.appendFileSync("output.txt", "\nAppended text.", "utf8");
  content = fs.readFileSync("output.txt", "utf8");
  console.log("Updated file content:", content);

  fs.unlinkSync("output.txt");
} else {
  console.error("File does not exist.");
}
