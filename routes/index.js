const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var sql = require("mssql");
const { networkInterfaces } = require("os");
const publicIp = require("public-ip");
const ipAddress = require("public-ip");

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
    const nets = networkInterfaces();
    const address = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === "IPv4" && !net.internal) {
          if (!address[name]) {
            address[name] = [];
          }
          sqlConfig.ipaddrss = net.address;
          address[name].push(net.address);
        }
      }
    }
    pool = await sql.connect(sqlConfig);
    const query = await pool
      .request()
      .query("select count(*) as count from tbl_employee");
    result = `Found ${query.recordset[0].count} employees on db`;

  } catch (e) {
    error = e;
  } finally {
    sql.close();
  }

  const ipadress = await  publicIp.v4();
  sqlConfig.sourceIpaddress = ipadress;

  res.render("index", {
    error,
    result,
    form: sqlConfig,
  });
});



module.exports = router;
