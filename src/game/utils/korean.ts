/** 마지막 글자에 받침이 있는지 (한글이 아니면 없는 것으로 처리) */
function hasFinalConsonant(word: string): boolean {
  const code = word.trim().charCodeAt(word.trim().length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/** "토끼" + 이/가 → "토끼가" */
export function withSubject(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "이" : "가"}`;
}

/** "토끼" + 은/는 → "토끼는" */
export function withTopic(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "은" : "는"}`;
}

/** "토끼" + 을/를 → "토끼를" */
export function withObject(word: string): string {
  return `${word}${hasFinalConsonant(word) ? "을" : "를"}`;
}
