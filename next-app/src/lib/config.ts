export function getStocksList(): { id: string; label: string }[] {
  const env = process.env.STOCKS || '';
  return env.split(',').filter(Boolean).map(pair => {
    const [id, label] = pair.split(':');
    return { id, label };
  });
}
