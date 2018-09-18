declare module 'greg' {
  export function sentence(): string;
  export function parse(sentence: string): number;

  export const adjectives: string[];
  export const nouns: string[];
  export const verbs: string[];
  export const adverbs: string[];
}
