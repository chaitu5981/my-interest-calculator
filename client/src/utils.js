export const formatDate = (date1) => {
  let d = date1.getDate();
  let m = date1.getMonth() + 1;
  const y = date1.getFullYear();
  if (d < 10) d = "0" + d;
  if (m < 10) m = "0" + m;
  return d + "/" + m + "/" + y;
};
