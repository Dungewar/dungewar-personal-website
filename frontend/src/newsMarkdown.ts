type ListType = "ol" | "ul";

type ListLevel = {
  type: ListType;
  indent: number;
};

const escapeHtml = (value: string): string => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

function sanitizeUrl(url: string): string | null {
  const decoded = url.replace(/&amp;/g, "&").trim();
  return /^(https?:\/\/|mailto:|\/)/i.test(decoded) ? url.trim() : null;
}

function parseInline(value: string): string {
  const tokens: string[] = [];
  const saveToken = (html: string): string => {
    tokens.push(html);
    return `\uFFF0${tokens.length - 1}\uFFF1`;
  };

  let text = value.replace(/`([^`]+)`/g, (_match, code: string) => saveToken(`<code>${code}</code>`));

  text = text.replace(/\[([^\]]+)\]\(([^()\s]+(?:\([^()\s]*\)[^()\s]*)?)\)/g, (_match, label: string, rawUrl: string) => {
    const safeUrl = sanitizeUrl(rawUrl);
    return safeUrl
      ? saveToken(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`)
      : label;
  });

  text = text.replace(/(https?:\/\/[^\s<"']+)/g, (_match, rawUrl: string) => {
    let cleanUrl = rawUrl;
    let suffix = "";
    const trailing = cleanUrl.match(/[.,!?:;)]+$/);
    if (trailing) {
      suffix = trailing[0];
      cleanUrl = cleanUrl.slice(0, -suffix.length);
    }
    const safeUrl = sanitizeUrl(cleanUrl);
    return safeUrl
      ? `${saveToken(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`)}${suffix}`
      : `${cleanUrl}${suffix}`;
  });

  text = text.replace(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, (_match, email: string) => (
    saveToken(`<a href="mailto:${email}">${email}</a>`)
  ));

  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1<em>$2</em>$3")
    .replace(/(^|[^_])_([^_]+)_([^_]|$)/g, "$1<em>$2</em>$3")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/\uFFF0(\d+)\uFFF1/g, (_match, index: string) => tokens[Number(index)] ?? "");
}

export function newsMarkdownToHtml(rawText: string): string {
  if (!rawText) return "<p><em>No content provided.</em></p>";

  const lines = escapeHtml(rawText).split(/\r?\n/);
  const output: string[] = [];
  const listStack: ListLevel[] = [];
  let paragraphLines: string[] = [];
  let blockquoteLines: string[] = [];
  let codeBlockContent: string[] = [];
  let inBlockquote = false;
  let inCodeBlock = false;

  const closeListsToDepth = (depth: number) => {
    while (listStack.length > depth) {
      const popped = listStack.pop();
      if (popped) output.push(`</li></${popped.type}>`);
    }
    if (listStack.length > 0 && depth === listStack.length) output.push("</li>");
  };
  const closeAllLists = () => closeListsToDepth(0);
  const flushBlockquote = () => {
    if (!inBlockquote) return;
    output.push(`<blockquote>${blockquoteLines.join("<br>")}</blockquote>`);
    blockquoteLines = [];
    inBlockquote = false;
  };
  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    output.push(`<p>${paragraphLines.join("<br>")}</p>`);
    paragraphLines = [];
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const codeFence = line.match(/^```([a-zA-Z0-9_-]*)/);
    if (codeFence) {
      if (!inCodeBlock) {
        flushParagraph();
        flushBlockquote();
        closeAllLists();
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        output.push(`<pre><code>${codeBlockContent.join("\n")}</code></pre>`);
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    if (/^\s*([-*_]\s*){3,}\s*$/.test(line)) {
      flushParagraph();
      flushBlockquote();
      closeAllLists();
      output.push("<hr>");
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushBlockquote();
      closeAllLists();
      const level = Math.min(heading[1].length + 1, 6);
      output.push(`<h${level}>${parseInline(heading[2])}</h${level}>`);
      continue;
    }

    const blockquote = line.match(/^>\s?(.*)$/);
    if (blockquote) {
      flushParagraph();
      closeAllLists();
      inBlockquote = true;
      blockquoteLines.push(parseInline(blockquote[1]));
      continue;
    }
    if (inBlockquote) flushBlockquote();

    const unordered = line.match(/^(\s*)([-*+•⁃‣]|–|—)\s+(.*)$/);
    const ordered = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    const listMatch = unordered ?? ordered;
    if (listMatch) {
      flushParagraph();
      flushBlockquote();

      const listType: ListType = ordered ? "ol" : "ul";
      const indent = listMatch[1].length;
      const itemText = parseInline(listMatch[3]);

      if (listStack.length === 0) {
        listStack.push({ type: listType, indent });
        output.push(`<${listType}><li>${itemText}`);
      } else {
        const top = listStack[listStack.length - 1];
        if (indent > top.indent) {
          listStack.push({ type: listType, indent });
          output.push(`<${listType}><li>${itemText}`);
        } else if (indent < top.indent) {
          while (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
            const popped = listStack.pop();
            if (popped) output.push(`</li></${popped.type}>`);
          }
          const current = listStack[listStack.length - 1];
          if (current && current.type !== listType && current.indent === indent) {
            listStack.pop();
            output.push(`</li></${current.type}>`);
            listStack.push({ type: listType, indent });
            output.push(`<${listType}><li>${itemText}`);
          } else if (current) {
            output.push(`</li><li>${itemText}`);
          } else {
            listStack.push({ type: listType, indent });
            output.push(`<${listType}><li>${itemText}`);
          }
        } else if (top.type !== listType) {
          listStack.pop();
          output.push(`</li></${top.type}>`);
          listStack.push({ type: listType, indent });
          output.push(`<${listType}><li>${itemText}`);
        } else {
          output.push(`</li><li>${itemText}`);
        }
      }
      continue;
    }

    if (line.trim() === "") {
      if (listStack.length > 0) {
        const nextNonEmpty = lines.slice(lineIndex + 1).find((candidate) => candidate.trim() !== "");
        const continuesList = nextNonEmpty && (
          /^(\s*)([-*+•⁃‣]|–|—|\d+\.)\s+/.test(nextNonEmpty)
          || /^\s{2,}\S/.test(nextNonEmpty)
        );
        if (continuesList) continue;
        closeAllLists();
      }
      flushParagraph();
      flushBlockquote();
      continue;
    }

    if (listStack.length > 0) {
      const continuation = line.match(/^(\s*)(.*)$/);
      if (continuation && continuation[1].length >= 2) {
        output.push(`<div class="list-item-extra">${parseInline(continuation[2])}</div>`);
        continue;
      }
    }

    closeAllLists();
    paragraphLines.push(parseInline(line));
  }

  if (inCodeBlock) output.push(`<pre><code>${codeBlockContent.join("\n")}</code></pre>`);
  flushParagraph();
  flushBlockquote();
  closeAllLists();
  return output.join("\n");
}
