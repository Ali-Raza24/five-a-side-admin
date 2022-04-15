function mapHours(from, to) {
  let hours = [];

  for (let i = from; i <= to; i++){
    let time = i + ":00";
    if (i < 10) {
      time = "0" + time;
    }
    hours.push(time);
  }

  return hours;
}

export default mapHours;
