//  ['a','b']=>{a:true, b:true}
export const getSelectData = (
  select: string[] = []
): Record<string, boolean> => {
  return Object.fromEntries(select.map((el) => [el, true]));
};
