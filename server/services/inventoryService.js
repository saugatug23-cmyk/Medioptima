exports.determineAvailability = (quantity) => {
  if (quantity > 10) return 'AVAILABLE';
  if (quantity > 0 && quantity <= 10) return 'PARTIAL';
  return 'UNAVAILABLE';
};
