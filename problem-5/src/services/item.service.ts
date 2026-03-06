import {
  FindOptionsWhere,
  ILike,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { AppDataSource } from "../config/database";
import { Item } from "../entities/Item";
import { NotFoundError } from "../middleware/error.middleware";
import type {
  CreateItemDto,
  UpdateItemDto,
  ItemFilters,
  PaginatedResponse,
} from "../types";

const repository = () => AppDataSource.getRepository(Item);

export const itemService = {
  async create(dto: CreateItemDto): Promise<Item> {
    const item = repository().create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      status: dto.status ?? "active",
    });
    return repository().save(item);
  },

  async list(filters: ItemFilters): Promise<PaginatedResponse<Item>> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);
    const sort = filters.sort ?? "createdAt";
    const order = filters.order ?? "DESC";

    const where: FindOptionsWhere<Item> = {};

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`);
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      where.price = Between(filters.minPrice, filters.maxPrice);
    } else if (filters.minPrice !== undefined) {
      where.price = MoreThanOrEqual(filters.minPrice);
    } else if (filters.maxPrice !== undefined) {
      where.price = LessThanOrEqual(filters.maxPrice);
    }

    const [data, total] = await repository().findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string): Promise<Item> {
    const item = await repository().findOneBy({ id });
    if (!item) throw new NotFoundError("Item", id);
    return item;
  },

  async update(id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.getById(id);
    Object.assign(item, dto);
    return repository().save(item);
  },

  async delete(id: string): Promise<void> {
    const item = await this.getById(id);
    await repository().remove(item);
  },
};
