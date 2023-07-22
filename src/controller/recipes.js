const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
const {
  selectAllRecipes,
  selectRecipesById,
  selectRecipesByUserId,
  insertRecipes,
  updateRecipes,
  deleteRecipes,
  countData,
  findUUID,
} = require("../model/recipes");

const recipesController = {
  getAllRecipes: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "recipes_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllRecipes({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };

      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  getRecipesById: (req, res, next) => {
    const recipes_id = String(req.params.recipes_id);
    selectRecipesById(recipes_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  getRecipesByUserId: (req, res, next) => {
    const users_id = String(req.params.users_id);
    selectRecipesByUserId(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertRecipes: async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    const recipes_photo = result.secure_url;
    const { recipes_title, recipes_ingredients, users_id, recipes_video } =
      req.body;
    const recipes_id = uuidv4();
    const data = {
      recipes_id,
      recipes_title,
      recipes_ingredients,
      recipes_photo,
      recipes_video,
      users_id,
    };
    insertRecipes(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Product Success")
      )
      .catch((err) => res.send(err));
  },

  updateRecipe: async (req, res) => {
    try {
      const recipes_id = String(req.params.recipes_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const recipes_photo = result.secure_url;
      const { recipes_title, recipes_ingredients, recipes_video } = req.body;
      const { rowCount } = await findUUID(recipes_id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      const data = {
        recipes_title,
        recipes_ingredients,
        recipes_photo,
        recipes_video,
        categorys_id,
      };
      updateRecipes(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Product updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteRecipe: async (req, res, next) => {
    try {
      const recipes_id = String(req.params.id);
      const { rowCount } = await findUUID(recipes_id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      await deleteRecipes(recipes_id);
      commonHelper.response(res, {}, 200, "Recipe deleted");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = recipesController;