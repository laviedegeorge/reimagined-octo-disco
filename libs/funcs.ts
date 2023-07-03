export const shortenAddress = (address) => {
  try {
    const addressArr = (address || "").split("");
    const first = addressArr.splice(0, 5).join("");
    const second = addressArr
      .splice(addressArr.length - 4, addressArr.length)
      .join("");
    return `${first}...${second}`;
  } catch (error) {
    console.log(error);
    return "xxxx...xxx";
  }
};
