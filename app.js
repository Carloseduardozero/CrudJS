const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();

const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   port:3306
});
sql.query("use crude");
app.use('/img',express.static('img'))



app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');  

app.get("/views",function(req,res){
  //  res.render('index',{id:req.params.id});
    //console.log(req.params.id);
    res.render('index')
});


// insert

app.get("/inserir",function(req,res){res.render("inserir");});
app.post("/controllerForm",urlencodeParser,function(req,res){
    sql.query("insert into tabela values (?,?,?)",[req.body.id,req.body.name,req.body.age]);
    res.render('controllerForm',{name:req.body.name});
});

// select

app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from tabela order by id asc",function(err,results,fields){
           res.render('select',{data:results});
        });
    }else{
        sql.query("select * from tabela where id=? order by id asc",[req.params.id],function(err,results,fields){
            res.render('select',{data:results});
        });
    }
});

//deletar 

app.get('/deletar/:id',function(req,res){
    sql.query("delete from tabela where id=?",[req.params.id]);
    res.render('deletar');
});

//update controllerUpdate.handlebars

app.get("/update/:id",function(req,res){
    sql.query("select * from tabela where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
    });
});
app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update tabela set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
   res.render('controllerUpdate');
});


//Start server
app.listen(3000,function(req,res){
    console.log('Servidor está rodando!');
 });