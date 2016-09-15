export function ALL() {
  return true;
}

export function ID(x) {
  return x;
}

export function ID2(x, y) {
  return y;
}

export function DIE(x) {
  throw x;
}

export function DIE2(x, y) {
  throw y;
}
