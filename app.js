const mysql = require('mysql');
const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("assets"));


/* **********ROUTES********** */

app.get("/", async function(req, res){
    let categories, authors;
    
    try{
        categories = await getCategories();
        authors = await getAuthors();
    } catch(err){
        console.log("Error: " + err);
        return res.status(500).send();
    }
    
    res.render("index", {"categories":categories, "authors":authors});
}); //root route

app.get("/quotes", async function(req, res){
    
    let rows = await getQuotes(req.query);
    
    res.send(rows);

});//quotes

app.get("/authorInfo", async function(req, res){
    
   let rows = await getAuthorInfo(req.query.authorId);
  //res.render("quotes", {"records":rows});
    res.send(rows);
});//authorInfo

/* **********FUNCTIONS********** */

//values in red must be updated
function dbConnection(){

    let conn = mysql.createConnection({
        host: "cst336db.space",
        user: "cst336_dbUser27",
        password: "uzef6q",
        database:"cst336_db27"
    }); //createConnection

    console.log("DB connection established.");
return conn;

}

function getAuthorInfo(authorId){
    let conn = dbConnection();
    
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT * 
                      FROM q_author
                      WHERE authorId = ${authorId}`;
            
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise
    
}


function getQuotes(query){
    let keyword = query.searchTerm;
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            
            let params = [];
            
            let sql = 
                `SELECT * FROM q_quotes
                NATURAL JOIN q_author 
                WHERE
                (quote LIKE '%${keyword}%'`;
            
            if (query.category) { //user selected a category
                sql += " AND category = '" + query.category +"'"; //To prevent SQL injection, SQL statement shouldn't have any quotes.
            }
            
            if (query.gender) { //user selected a sex
                sql += " AND sex = '" + query.gender +"'"; //To prevent SQL injection, SQL statement shouldn't have any quotes.
            }
            
            if (query.authorId) { //user selected a sex
                sql += " AND authorId = " + query.authorId; //To prevent SQL injection, SQL statement shouldn't have any quotes.
            }
            
            sql += ")";
            
            params.push(query.category);
            params.push(query.gender);
            params.push(query.authorId);
            
            conn.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            conn.end();
            resolve(rows);
            });
        
        });
    });
}


function getAuthors(){
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT authorId, firstName, lastName 
                      FROM q_author
                      ORDER BY authorId`;
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              console.log("Authors received");
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise
}

function getCategories(){
    
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT DISTINCT category 
                      FROM q_quotes
                      ORDER BY category`;
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              console.log("Categories received");
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise
}

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
})