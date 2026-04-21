export const calculateNextReview = (difficulty) => {
    const now = new Date();
    switch (difficulty) {
      case "again":
        // Review in 1 minute
        return new Date(now.getTime() + 1 * 60 * 1000);
      case "hard":
        // Review in 1 day
        return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
      case "good":
        // Review in 3 days
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      case "easy":
        // Review in 7 days
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return now;
    }
  };
  export const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "again": return "#e53e3e";
      case "hard":  return "#dd6b20";
      case "good":  return "#38a169";
      case "easy":  return "#3182ce";
      default:      return "#718096";
    }
  };