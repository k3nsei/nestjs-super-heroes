export abstract class Repository<T, U> {
  public async create(entry: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async update(id: U, entry: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async delete(id: U): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async find(entry: Partial<T>): Promise<ReadonlyArray<T>> {
    throw new Error('Method not implemented.');
  }

  public async findOne(id: U): Promise<Readonly<T> | null> {
    throw new Error('Method not implemented.');
  }
}
