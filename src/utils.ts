export function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function replaceAll(str: string, search: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(search), "g"), replacement);
}