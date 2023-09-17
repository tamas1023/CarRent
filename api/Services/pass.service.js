const lengthCheck = (password) => {
  return password.length >= 8;
};
const numberCheck = (password) => {
  const numbers = "0123456789";
  let hasNumber = false;
  for (let i = 0; i < numbers.length; i++) {
    if (password.includes(numbers[i])) {
      hasNumber = true;
      break;
    }
  }

  return hasNumber;
};
const lowerUpperCheck = (password) => {
  return (
    password != password.toLowerCase() && password != password.toUpperCase()
  );
};
exports.lengthCheck = lengthCheck;
exports.numberCheck = numberCheck;
exports.lowerUpperCheck = lowerUpperCheck;
