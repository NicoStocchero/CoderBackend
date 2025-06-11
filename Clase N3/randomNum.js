const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + 1;
};

const calculateNumbers = (quantity, min, max) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!quantity || !min || !max) {
        reject("Invalid input");
      }

      const numbers = {};

      for (let i = 0; i <= quantity; i++) {
        const random = randomNum(min, max);
        if (!numbers[random]) {
          numbers[random] = 1;
        } else {
          numbers[random]++;
        }
      }
      resolve(numbers);
    }, 2000);
  });
};

calculateNumbers(8e7, 1, 20)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
