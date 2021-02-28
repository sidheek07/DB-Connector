const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var sql = require("mssql");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { result: null, error: null, form: {} });
});

router.post("/connect", async (req, res) => {
  let error;
  let result;
  let pool;
  var sqlConfig = {
    user: req.body.user,
    password: req.body.password,
    server: req.body.server,
    database: req.body.database,
  };

  try {
    console.log("sql connecting");
    pool = await sql.connect(sqlConfig);
    const query = await pool
      .request()
      .query("select count(*) as count from tbl_employee"); //
    result = `Found ${query.recordset[0].count} employees on db`;
  } catch (e) {
    error = e;
  } finally {
    sql.close();
  }
  console.log(sqlConfig);
  res.render("index", {
    error,
    result,
    form: sqlConfig,
  });
});

module.exports = router;
