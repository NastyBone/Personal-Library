/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB_KEY;


MongoClient.connect(MONGODB_CONNECTION_STRING, (err ,db) =>{
  console.log('Connected!')
})

module.exports = function (app) {

  app.route('/api/books')
  
    .get(function (req, res){
    
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) =>{
      
      db.collection('books').find({}).toArray((err,data) =>{
        res.json(data)
        
      })
    })
  })
  
      //DONE
    .post(function (req, res){
      var title = req.body.title;
      if (!title) res.send('Error! No title given')
    
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db)=>{
    
      db.collection('books').insertOne({title: title, comments: [], commentcount: 0},(err,data)=>{
        data._id = data.insertedId
        
        res.json({title: title, _id: data._id})
      
    })
      
    })

      
      //response will contain new book object including atleast _id and title
    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) =>{
      db.collection('books').deleteMany({}, (err, data) =>{
      
   //     if (err) res.send('FATAL ERROR: Could not delete data')
         
      
        
      })
      
    })
      res.json('Complete delete sucessful')
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;

    try { 
      bookid = new ObjectId(bookid)
    } catch (e){ 
      res.send('Could not find the book required')
    }
    
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) =>{
      db.collection('books').findOne({_id: bookid}, (err,data) =>{
      if (err) res.send('Could not find the book required')
  //    if (data.value.comments[0] = '' && data.comments.length < 2) data.comments.shift()
        console.log(data.value)
       res.json({_id: bookid, title: data.title, comments: data.comments}) 
        
      })
    })

      
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      console.log('')
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get+
      console.log(comment)
      try{
        bookid = new ObjectId(bookid) 
        
      } catch(e){
        res.send('Could not find the book required')
      }
      
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) =>{
      db.collection('books').findOneAndUpdate({_id: bookid}, {$push: {comments: comment}, $inc :{commentcount: 1}}, {new: true}, (err,data) =>{

       if(err) res.text('Could not find the book required') 
        
     res.json({_id: bookid, title: data.value.title, comments: data.value.comments.concat(comment)}) 

      })
    })
    
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      
      try{
        bookid = new ObjectId(bookid)
      } catch(e){ res.send('Could not find the book required')
                }
    
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) =>{
      
    db.collection('books').findOneAndDelete({_id: bookid}, (err,data) =>{
      if (err) {res.send('Could not find the book required')}
      
      
      
    })
      
      
    })    
    });
  
};
