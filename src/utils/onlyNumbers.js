export function onlyNumbers(value) {
  if (!value) {
    return '';
  }

  return value.replace(/\D/g, '');
}
