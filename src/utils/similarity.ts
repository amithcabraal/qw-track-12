export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const ngrams = (str: string) => {
    const result = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      result.add(str.slice(i, i + 2));
    }
    return result;
  };

  const set1 = ngrams(s1);
  const set2 = ngrams(s2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  return (2.0 * intersection.size) / (set1.size + set2.size);
}