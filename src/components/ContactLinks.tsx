import React from "react";

export default function ContactLinks() {
  return (
    <div className="mt-4 flex flex-wrap gap-2 text-xs">
      <a
        href="https://www.linkedin.com/in/lucas-miranda-ribeiro-0a00b83a0/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-cyan-700 px-3 py-1 font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-cyan-600"
      >
        LinkedIn
        <span className="text-[10px]">↗</span>
      </a>

      <a
        href="https://x.com/RootLumiko"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-700 px-3 py-1 font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-zinc-600"
      >
        (X) Twitter
        <span className="text-[10px]">↗</span>
      </a>

      <a
        href="mailto:Lucasmirandar11+contact@gmail.com"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-red-800 px-3 py-1 font-medium text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-red-700"
      >
        Email
        <span className="text-[10px]">↗</span>
      </a>
    </div>
  );
}
