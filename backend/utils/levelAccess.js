exports.getAllowedLevels = (level) => {
  if (level === "4-5") return ["4-5"];
  if (level === "6-8") return ["4-5", "6-8"];
  if (level === "9-10") return ["4-5", "6-8", "9-10"];
  if (level === "11-12") return ["4-5", "6-8", "9-10", "11-12"];
  if (level === "1-2") return ["4-5", "6-8", "9-10", "11-12", "1-2"];
  if (level === "3-4") return ["4-5", "6-8", "9-10", "11-12", "1-2", "3-4"];
  return [];
};