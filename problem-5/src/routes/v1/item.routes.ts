import { Router } from "express";
import { itemController } from '../../controllers/item.controller';
import {
  validate,
  createItemRules,
  updateItemRules,
} from '../../middleware/validate.middleware';

const router = Router();

router.post("/", validate(createItemRules), itemController.create);
router.get("/", itemController.list);
router.get("/:id", itemController.getById);
router.put("/:id", validate(updateItemRules), itemController.update);
router.delete("/:id", itemController.delete);

export default router;
