const commonHelper = require("../helper/common");
const {
  selectAllBookmarks,
  selectBookmarks,
  insertBookmarks,
  updateBookmarks,
  deleteBookmarks,
  countData,
  findID,
} = require("../model/bookmarks");

const bookmarksController = {
  getAllBookmarks: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "bookmarks_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllBookmarks({ limit, offset, sort, sortby });
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

  getSelectBookmarks: async (req, res) => {
    const users_id = String(req.params.users_id);
    selectBookmarks(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertBookmarks: async (req, res) => {
    const { recipes_id, users_id } = req.body;
    const {
      rows: [count],
    } = await countData();
    const bookmarks_id = Number(count.count) + 1;
    const data = {
      bookmarks_id,
      recipes_id,
      users_id,
    };
    insertBookmarks(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Comment Success")
      )
      .catch((err) => res.send(err));
  },

  updateBookmarks: async (req, res) => {
    try {
      const bookmarks_id = Number(req.params.id);
      const { comment_text } = req.body;
      const { rowCount } = await findID(bookmarks_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        comment_id,
        recipes_id,
        users_id,
        comment_text,
      };
      updateBookmarks(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteBookmarks: async (req, res, next) => {
    try {
      const bookmarks_id = Number(req.params.id);
      const { rowCount } = await findID(bookmarks_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteBookmarks(bookmarks_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete comment Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = bookmarksController;
