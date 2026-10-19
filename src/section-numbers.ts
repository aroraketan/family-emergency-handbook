/** Builds sequential section numbers for only the sections that will render. */
export function createSectionNumbers(flags: Record<string, boolean>): Record<string, number> {
  const numbers: Record<string, number> = {};
  let next = 1;
  for (const [key, visible] of Object.entries(flags)) {
    if (visible) {
      numbers[key] = next;
      next += 1;
    }
  }
  return numbers;
}
