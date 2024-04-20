import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const params = {
  host: "localhost",
  port: 5432,
  database: "permalist",
  user: "postgres",
  password: "Angale1971"
};

let items = [];


app.get("/", async (req, res) => {
  
  items = [];
  //create the connection
  const db = await new pg.Client(params);
  db.connect();//connecting

  //select the to do list
  const result = await db.query("select * from list");
  
  //fill the array
  result.rows.forEach(item => {
    items.push(item);
  });

  //console.log(items);
  db.end();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  const db = await new pg.Client(params);
  db.connect();

  try {
    await db.query(`
    insert into list (title)
    values ('${item}')
    `);
  } catch (error) {
    console.log(error);
  }

  db.end();

  res.redirect("/");
});

app.post("/edit", async (req, res) => {

  console.log(req.body);

  const db = await new pg.Client(params);
  db.connect();

  try {
    await db.query(`
    update list 
    set title = '${req.body.updatedItemTitle}'
    where id = ${req.body.updatedItemId}
    `);
  } catch (error) {
    console.log(error);
  }

  db.end();

  res.redirect("/");


});

app.post("/delete", async (req, res) => {
  //console.log(req.body);
  const db = await new pg.Client(params);
  db.connect();

  try {
    await db.query(`
      delete from list
      where id = ${req.body.deleteItemId}
    `);
  } catch (error) {
    console.log(error);
  }

  db.end();

  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
