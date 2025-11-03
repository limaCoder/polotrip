export function snakeToCamelDbFields<T = Record<string, unknown>>(
  obj: Record<string, unknown>
): T {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      if (
        typeof obj[key] === "string" &&
        (key.includes("_at") || camelKey.includes("At"))
      ) {
        try {
          result[camelKey] = new Date(obj[key]);
        } catch {
          result[camelKey] = obj[key];
        }
      } else {
        result[camelKey] = obj[key];
      }
    }
  }

  return result as unknown as T;
}
