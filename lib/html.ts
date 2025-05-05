import {
  Document,
  DocumentFragment,
  DOMParser,
  Element,
  HTMLTemplateElement,
  Node,
} from "@b-fuze/deno-dom";
import { HSAttrs, HSNode, HyperStatic, hyperstatic } from "@mdekstrand/hyperstatic";
import { ensureDir } from "@std/fs/ensure-dir";
import { join } from "@std/path/join";

export { Document, DocumentFragment, DOMParser, Element, HTMLTemplateElement, hyperstatic, Node };
export type { HSAttrs, HyperStatic };
export type HTML = Element | DocumentFragment;
export type HTMLish = HSNode<Node>;

export interface HyperDOM extends HyperStatic<Node, Element> {
  document: Document;
}

export function parseHTML(html: string): Document {
  let parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

export function renderHTML(node: Document | Element) {
  let html;
  if (node.nodeType == Node.DOCUMENT_NODE) {
    // @ts-ignore DOM access is fine
    html = node.documentElement.outerHTML;
  } else {
    // @ts-ignore DOM access is fine
    html = node.outerHTML;
  }
  return "<!doctype html>\n" + html;
}

export async function writeIndexHTML(dir: string, html: Document | Element) {
  await ensureDir(dir);
  await Deno.writeTextFile(join(dir, "index.html"), renderHTML(html));
}
