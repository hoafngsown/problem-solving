import { Request, Response, NextFunction } from "express";
import { itemService } from "../services/item.service";
import type { ItemFilters } from "../types";

export const itemController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemService.create(req.body);
      res.status(201).json({ status: "success", data: item });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ItemFilters = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sort: req.query.sort as string | undefined,
        order: req.query.order as "ASC" | "DESC" | undefined,
        name: req.query.name as string | undefined,
        status: req.query.status as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };
      const result = await itemService.list(filters);
      res.json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const item = await itemService.getById(req.params.id);
      res.json({ status: "success", data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemService.update(req.params.id, req.body);
      res.json({ status: "success", data: item });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await itemService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
