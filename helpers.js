export const secondsToString = (seconds) => {
  const date = new Date(seconds * 1000);
  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getSeconds();
  let output = "";
  if (hh != 0) {
    if (hh < 10) {
      hh = "0" + hh;
    }
    output += `${hh}:`;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  output += `${mm}:`;
  if (ss < 10) {
    ss = "0" + ss;
  }
  output += ss;
  return output;
};
