module.exports = {
  // takes in a timestamp and formats the date
  format_date: (date) => {
    if (!date) {
      return '';
    }
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },
};