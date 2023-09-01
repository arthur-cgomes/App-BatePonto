import { Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const repositoryMockFactory = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  create: jest.fn((entity) => entity),
  preload: jest.fn((entity) => entity),
  findAndCount: jest.fn((entity) => entity),
  find: jest.fn((entity) => entity),
  findByIds: jest.fn((entity) => entity),
  findBy: jest.fn((entity) => entity),
  remove: jest.fn((entity) => entity),
});
