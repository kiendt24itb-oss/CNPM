const express = require("express");
const router = express.Router();
const RecipeController = require("../controllers/RecipeController");
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

// Tất cả API trong này đều cần Đăng nhập
router.use(verifyToken);

// --- Routes cho Công thức (Recipe) ---
router.get("/", RecipeController.getAllRecipes);
router.get("/:id", RecipeController.getRecipeDetail);
router.post("/", authorizeRole("ADMIN"), RecipeController.createRecipe);
router.delete("/:id", authorizeRole("ADMIN"), RecipeController.deleteRecipe);

// --- Routes cho Chi tiết nguyên liệu (Recipe Details) ---
// Sửa định lượng: PATCH /api/recipes/1/ingredients/5
router.patch(
  "/:recipeId/ingredients/:ingredientId",
  authorizeRole("ADMIN"),
  RecipeController.updateIngredientQuantity,
);

// Xóa 1 nguyên liệu: DELETE /api/recipes/1/ingredients/5
router.delete(
  "/:recipeId/ingredients/:ingredientId",
  authorizeRole("ADMIN"),
  RecipeController.removeIngredient,
);

module.exports = router;
