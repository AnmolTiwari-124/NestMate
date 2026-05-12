const calculateMatch = (currentUser, otherUser) => {
  let score = 0;

  const insights = [];

  // Personality
  if (
    currentUser.personality ===
    otherUser.personality
  ) {
    score += 20;

    insights.push(
      "Same personality type"
    );
  }

  // Food Preference
  if (
    currentUser.habits?.foodPreference ===
    otherUser.habits?.foodPreference
  ) {
    score += 20;

    insights.push(
      "Same food preference"
    );
  }

  // Sleep Time
  if (
    currentUser.habits?.sleepTime ===
    otherUser.habits?.sleepTime
  ) {
    score += 15;

    insights.push(
      "Similar sleep schedule"
    );
  }

  // Cleanliness
  if (
    currentUser.habits?.cleanliness ===
    otherUser.habits?.cleanliness
  ) {
    score += 15;

    insights.push(
      "Similar cleanliness habits"
    );
  }

  // Smoking
  if (
    currentUser.habits?.smoking ===
    otherUser.habits?.smoking
  ) {
    score += 10;
  }

  // Drinking
  if (
    currentUser.habits?.drinking ===
    otherUser.habits?.drinking
  ) {
    score += 10;
  }

  // Common Hobbies
  const commonHobbies =
    currentUser.hobbies?.filter((hobby) =>
      otherUser.hobbies?.includes(hobby)
    ) || [];

  if (commonHobbies.length > 0) {
    score += Math.min(
      commonHobbies.length * 5,
      10
    );

    insights.push(
      `Common interests: ${commonHobbies.join(
        ", "
      )}`
    );
  }

  return {
    score,
    commonHobbies,
    insights,
  };
};

module.exports = calculateMatch;