export function getTypeOfParam<T>(param: T): string {
  if (Array.isArray(param)) {
    return "array";
  }
  return typeof param;
}
