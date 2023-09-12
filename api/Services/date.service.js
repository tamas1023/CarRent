const dateToString = (date) => {
  const year = date.getFullYear();
  const month =
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = date.getHours();
  return `${year}-${month}-${day}-${hour}`;
};

exports.dateToString = dateToString;
