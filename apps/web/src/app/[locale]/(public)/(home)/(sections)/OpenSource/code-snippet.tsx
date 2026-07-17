type CodeSnippetProps = {
  title: string;
};

const quickstartLines = [
  "git clone https://github.com/marioaulima/polotrip.git",
  "cd polotrip && pnpm install",
  "docker compose up -d && pnpm run db:push",
  "pnpm dev",
];

export function CodeSnippet({ title }: CodeSnippetProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-foreground/10 bg-zinc-950 shadow-xl">
      <div className="flex items-center gap-2 border-zinc-800 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-zinc-500">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm text-zinc-100 leading-7">
        {quickstartLines.map((line) => (
          <code className="block" key={line}>
            <span className="mr-2 select-none text-zinc-600">$</span>
            {line}
          </code>
        ))}
      </pre>
    </div>
  );
}
