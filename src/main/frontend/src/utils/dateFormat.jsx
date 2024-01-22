export function formatDate(date) {
  if (!date) return ""; // date가 없을 경우 빈 문자열 반환

  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString(undefined, options);
}
