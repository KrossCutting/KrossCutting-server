function validateArrays(...arrays) {
  if (!arrays.every(Array.isArray)) {
    throw new Error("Arguments should be arrays");
  }
}

module.exports = validateArrays;
