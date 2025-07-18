export const countDefinedProps = <T extends object>(
  obj: T,
  groups: (keyof T)[][]
): number => {
  return groups.reduce((count, group) => {
    const hasValue = group.some((key) => {
      const value = obj[key];
      if (value == null || value == '')
        return false;
      if (Array.isArray(value))
        return value.length > 0;

      return true;
    });
    return hasValue ? count + 1 : count;
  }, 0);
};
