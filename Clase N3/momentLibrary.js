import moment from "moment";

const currentDate = moment();
const myBirthday = moment("19980728");

if (!myBirthday.isValid()) {
  console.error("Invalid date format for birthday");
}

const diffDays = currentDate.diff(myBirthday, "days");
console.log(`Days since my birthday: ${diffDays}`);
