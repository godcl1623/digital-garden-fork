export const PATH_ESCAPE_TABLE: { [key in string]: string } = {
  $: '$24',
  '+': '$2B',
  '/': '$2F',
  ' ': '+',
  '&': '$26',
};
