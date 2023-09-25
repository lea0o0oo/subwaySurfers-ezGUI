function generateCode(length) {
  let result = "";
  const characters = "2AB4CD1EFG3HIJ8KLM9N5OPQR7STU6VWX0YZ";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = { generateCode };
