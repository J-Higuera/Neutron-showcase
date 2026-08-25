export function formatTodayLabel(referenceDate = new Date()) {
  return referenceDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
