const express = require('express');
const fs = require("fs");
const csv = require("fast-csv");
const bodyParser = require('body-parser');
var DbConnection = require('./dbconn/DbConnection');
const AddressModel = require('./model/AddressModel');
const csvFile= "./excelSheet/excelData.csv";
var stream = fs.createReadStream(csvFile);
const app = express()
const port = 3000

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


DbConnection.StartConnection();

app.get('/', (req, res, next) => {
    res.send('Import CSV file using NodeJS' );
})

//API for reading the data from CSV file and insert into the monngodb collection
app.get("/importCsv", (req, res, next) => {
    var csvStream = csv.parse().on("data", function(data){      
    var item = new AddressModel({
        No: data[0],
        name: data[1],
        position: data[2],
        gender: data[3],
        contact:data[4] 
    });
             
    item.save(function(error){
    console.log(item);
        if(error){
            throw error;
        }
    }); 
        }).on("end", function(){
              console.log(" End of file import");
        });
      
        stream.pipe(csvStream);
        res.json({success : "Data imported successfully.", status : 200});
         
})

//API for adding data into the monngodb collection
app.post("/addData", (req, res, next) => {
    var details = {
        No: req.body.No,
        name: req.body.name,
        position: req.body.position,
        gender: req.body.gender,
        contact: req.body.contact
    }
    var Address = new AddressModel(details);
    Address.save()
    .then(data => {
        res.send({ data: data, status: 200, success: "Data added successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating data."
        });
    });
})

//API for getting all the data from collection
app.get("/getData", (req, res, next) => {
    AddressModel.find()
    .then(details => {
        res.send({data: details, status: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data."
        });
    });
})

//API for updating data by Id into the monngodb collection
app.put("/updateData/:Id", (req, res, next) => {
    AddressModel.findByIdAndUpdate(req.params.Id, {
        No: req.body.No,
        name: req.body.name,
        position: req.body.position,
        gender: req.body.gender,
        contact: req.body.contact,
    })
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Error updating data with id " + req.params.Id
        });
    });
});

//API for deleting data by Id from the monngodb collection
app.delete("/deleteData/:Id", (req, res, next) => {
    AddressModel.findByIdAndRemove(req.params.Id)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });
        }
        res.send({message: "Data deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Data not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Could not delete data with id " + req.params.Id
        });
    });
});