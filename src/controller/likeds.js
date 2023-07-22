const commonHelper = require("../helper/common");
const {
  selectAllLikeds,
  selectLikeds,
  insertLikeds,
  updateLikeds,
  deleteLikeds,
  countData,
  findID,
} = require("../model/likeds");

const likedsController = {
  getAllLikeds: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "likeds_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllLikeds({ limit, offset, sort, sortby });
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

  getSelectLikeds: async (req, res) => {
    const users_id = String(req.params.users_id);
    selectLikeds(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertLikeds: async (req, res) => {
    const { recipes_id, users_id } = req.body;
    const {
      rows: [count],
    } = await countData();
    const likeds_id = Number(count.count) + 1;
    const data = {
      likeds_id,
      recipes_id,
      users_id,
    };
    insertLikeds(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Comment Success")
      )
      .catch((err) => res.send(err));
  },

  updateLikeds: async (req, res) => {
    try {
      const likeds_id = Number(req.params.id);
      const { comment_text } = req.body;
      const { rowCount } = await findID(likeds_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        comment_id,
        recipes_id,
        users_id,
        comment_text,
      };
      updateLikeds(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteLikeds: async (req, res, next) => {
    try {
      const likeds_id = Number(req.params.id);
      const { rowCount } = await findID(likeds_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteLikeds(likeds_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = likedsController;
