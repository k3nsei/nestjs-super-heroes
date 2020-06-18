type SearchPredicate<T> = (entry: T) => boolean;

export class SearchUtils {
  public static contains<T>(prop: string, value: string): SearchPredicate<T> {
    return (entry: T): boolean => {
      return (
        !value ||
        entry[prop].toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
    };
  }

  public static equal<T>(prop: string, value: unknown): SearchPredicate<T> {
    return (entry: T): boolean => {
      return !value || entry[prop] === value;
    };
  }

  public static includes<T>(prop: string, value: unknown): SearchPredicate<T> {
    return (entry: T): boolean => {
      return !value || entry[prop].includes(value);
    };
  }

  private constructor() {}
}
