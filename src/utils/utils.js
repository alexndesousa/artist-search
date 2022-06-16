const chunkArray = (array, size) => {
  let newArray = [];
  for (let i = 0; i < array.length; i += size) {
    newArray.push(array.slice(i, i + size));
  }
  return newArray;
};

const generateRandomString = length => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while (text.length <= length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export { chunkArray, generateRandomString };
