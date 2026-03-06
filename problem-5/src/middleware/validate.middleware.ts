import { Request, Response, NextFunction } from "express";
import { ValidationError } from "./error.middleware";

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: "string" | "number";
  min?: number;
  max?: number;
  maxLength?: number;
  in?: string[];
};

const validateValue = (value: unknown, rule: ValidationRule): string | null => {
  if (
    rule.required &&
    (value === undefined || value === null || value === "")
  ) {
    return `${rule.field} is required`;
  }

  if (value === undefined || value === null) return null;

  if (rule.type === "number") {
    const num = Number(value);
    if (isNaN(num)) return `${rule.field} must be a number`;
    if (rule.min !== undefined && num < rule.min)
      return `${rule.field} must be at least ${rule.min}`;
    if (rule.max !== undefined && num > rule.max)
      return `${rule.field} must be at most ${rule.max}`;
  }

  if (rule.type === "string" && typeof value !== "string") {
    return `${rule.field} must be a string`;
  }

  if (
    rule.maxLength &&
    typeof value === "string" &&
    value.length > rule.maxLength
  ) {
    return `${rule.field} must be at most ${rule.maxLength} characters`;
  }

  if (rule.in && !rule.in.includes(String(value))) {
    return `${rule.field} must be one of: ${rule.in.join(", ")}`;
  }

  return null;
};

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];
      const error = validateValue(value, rule);
      if (error) errors.push(error);
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join("; "));
    }

    next();
  };
};

export const createItemRules: ValidationRule[] = [
  { field: "name", required: true, type: "string", maxLength: 255 },
  { field: "description", type: "string" },
  { field: "price", required: true, type: "number", min: 0 },
  { field: "status", type: "string", in: ["active", "inactive", "archived"] },
];

export const updateItemRules: ValidationRule[] = [
  { field: "name", type: "string", maxLength: 255 },
  { field: "description", type: "string" },
  { field: "price", type: "number", min: 0 },
  { field: "status", type: "string", in: ["active", "inactive", "archived"] },
];
