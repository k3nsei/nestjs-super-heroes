import { UUID } from '@super-heros/data';
import { isEmpty, isMatch } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from './repository';

export type SearchPredicate<T> = (entry: T) => boolean;

export abstract class InMemoryRepository<T, U = UUID> extends Repository<T, U> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private static isObject(obj: unknown): obj is object {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  private static isObjectWithAtLeastOneProperties(obj: unknown): boolean {
    return InMemoryRepository.isObject(obj) && !isEmpty(obj);
  }

  readonly #entries: Map<U, T> = new Map<U, T>();

  readonly #identifierKey: string;

  protected constructor(identifierKey: string = 'id') {
    super();

    this.#identifierKey = identifierKey;
  }

  public async find(
    input: Partial<T> | ReadonlyArray<SearchPredicate<T>>,
  ): Promise<ReadonlyArray<T>> {
    const predicates: ReadonlyArray<SearchPredicate<T>> | null =
      Array.isArray(input) && input.every((fn) => typeof fn === 'function')
        ? input
        : null;

    if (predicates !== null) {
      return Array.from(this.#entries.values()).filter((entry: T): boolean => {
        return predicates.reduce(
          (result: boolean, predicate: SearchPredicate<T>): boolean => {
            return result && predicate(entry);
          },
          true,
        );
      });
    }

    const pattern: Partial<T> = input as Partial<T>;

    if (!InMemoryRepository.isObject(pattern)) {
      return [];
    } else if (isEmpty(pattern)) {
      return Array.from(this.#entries.values());
    }

    return Array.from(this.#entries.values()).filter((entry: T): boolean => {
      return isMatch(entry, pattern);
    });
  }

  public async findOne(id: U): Promise<Readonly<T> | null> {
    return this.#entries.get(id) ?? null;
  }

  public async create(entry: T): Promise<boolean> {
    let id = entry[this.#identifierKey];

    if (id == null) {
      id = uuidv4();
      entry[this.#identifierKey] = id;
    }

    return !!this.#entries.set(id, entry);
  }

  public async update(id: U, entry: T): Promise<boolean> {
    if (!this.#entries.has(id)) {
      throw new ReferenceError(
        `Record with ${this.#identifierKey} = ${id} does not exist`,
      );
    } else if (!InMemoryRepository.isObjectWithAtLeastOneProperties(entry)) {
      throw new TypeError(`Provided entry isn't an object or it is empty`);
    }

    const identifierKey: string = this.#identifierKey;
    const prevEntry: T = this.#entries.get(id);
    const newEntry: T = Object.assign(prevEntry, entry, {
      [identifierKey]: id,
    });

    return !!this.#entries.set(id, newEntry);
  }

  public async delete(id: U): Promise<boolean> {
    return this.#entries.delete(id);
  }
}
