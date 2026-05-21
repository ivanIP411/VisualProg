export type CellData = {
  value: string | number;
  formula: string;
  display: string;
};
export type Coord = { row: number; col: number };
export type Range = { start: Coord; end: Coord } | null;
export function parseCoord(ref: string): Coord {
  const match = ref.match(/([A-Z]+)([0-9]+)/);
  if (!match) return { row: 0, col: 0 };
  let col = 0;
  for (let i = 0; i < match[1].length; i++) {
    col = col * 26 + (match[1].charCodeAt(i) - 64);
  }
  return { row: parseInt(match[2]) - 1, col: col - 1 };
}
export function formula(
  formula: string,
  getCellValue: (coord: Coord) => number
): number {
  try {
    let expr = formula.slice(1).trim().toUpperCase();
    const sumMatch = expr.match(/SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)/);
    if (sumMatch) {
      const start = parseCoord(sumMatch[1]);
      const end = parseCoord(sumMatch[2]);
      let total = 0;
      for (let r = start.row; r <= end.row; r++) {
        for (let c = start.col; c <= end.col; c++) {
          total += getCellValue({ row: r, col: c });
        }
      }
      return total;
    }
    const avgMatch = expr.match(/AVERAGE\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)/);
    if (avgMatch) {
      const start = parseCoord(avgMatch[1]);
      const end = parseCoord(avgMatch[2]);
      let total = 0, count = 0;
      for (let r = start.row; r <= end.row; r++) {
        for (let c = start.col; c <= end.col; c++) {
          total += getCellValue({ row: r, col: c });
          count++;
        }
      }
      return count === 0 ? 0 : total / count;
    }
    expr = expr.replace(/[A-Z]+[0-9]+/g, (ref) => {
      const coord = parseCoord(ref);
      return getCellValue(coord).toString();
    });
    return Function('"use strict";return (' + expr + ')')();
  } catch {
    return NaN;
  }
}
export type Document = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  rows: number;
  cols: number;
  cells: Record<string, CellData>;
  colW: number[];
  rowH: number[];
};