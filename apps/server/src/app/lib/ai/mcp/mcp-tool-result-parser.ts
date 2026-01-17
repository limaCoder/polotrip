export function parseMcpToolResult(result: unknown): unknown {
  if (result && typeof result === "object" && !Array.isArray(result)) {
    if ("text" in result && typeof result.text === "string") {
      try {
        return JSON.parse(result.text);
      } catch {
        return result;
      }
    }

    if (
      "content" in result &&
      Array.isArray(result.content) &&
      result.content.length > 0 &&
      typeof result.content[0] === "object" &&
      result.content[0] !== null &&
      "text" in result.content[0] &&
      typeof result.content[0].text === "string"
    ) {
      try {
        return JSON.parse(result.content[0].text);
      } catch {
        return result;
      }
    }

    return result;
  }

  if (typeof result === "string") {
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }

  return result;
}
