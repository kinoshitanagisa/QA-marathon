const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3518;

const cors = require("cors");　
//app.use(cors());

app.use(cors({      
  origin: '*',　　　//全てのオリジンからのアクセスを許可する　なぎさ追記　
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  //全てのメソッドOK　なぎさ追記
}));　



// PostgreSQLの接続プール（connection pool）を作成
const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3518", // PostgreSQLのユーザー名に置き換えてください
  host: "db", //localhost（自分自身）→ postgresqlのホスト名dbに変更
  database: "crm_3518", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3518", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",　//company_namを修正12/12（木下）
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));
