import type { ReactElement } from "react";

export function renderMarkdownText(text: string): (string | ReactElement)[] {
  const parts: (string | ReactElement)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;
  let keyCounter = 0;

  while (true) {
    match = regex.exec(text);

    if (match === null) break;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(<strong key={`bold-${keyCounter++}`}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
