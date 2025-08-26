import { join } from 'node:path';
import * as fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';

import { HSAttrs, HSNode, HyperStatic, hyperstatic } from "@mdekstrand/hyperstatic";

export type { HSAttrs, HyperStatic };
export type HTML = Element | DocumentFragment;
export type HTMLish = HSNode<Node>;

export interface HyperDOM extends HyperStatic<Node, Element> {
  document: Document;
}

export function parseHTML(html: string): Document {
  let dom = new JSDOM(html);
  return dom.window.document;
}

export function renderHTML(node: Document | Element) {
  let html;
  if (node.nodeType == node.DOCUMENT_NODE) {
    // @ts-ignore DOM access is fine
    html = node.documentElement.outerHTML;
  } else {
    // @ts-ignore DOM access is fine
    html = node.outerHTML;
  }
  return "<!doctype html>\n" + html;
}

export async function writeIndexHTML(dir: string, html: Document | Element) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(join(dir, "index.html"), renderHTML(html), { encoding: 'utf-8' });
}
