const express = require("express");
const app = express();
const db = require("./mysqlConnection")

const port = process.env.port || 3000;

db.connect((err) => {
    if(err) console.log(err);
    else console.log("MySQL DB Connected");
});

//Concept Information Route
app.get("/concept_information/CUI/:CUI", (req, res) => {
    var query = "SELECT * " +
                "FROM mrconso " +
                "WHERE CUI = \'" + req.params.CUI + "\';";

    db.query(query, (err, Concept_Information) => {
        if(err){
            console.log("Error retrieving CUI information");
            res.json({CUI: "CUI Does Not Exist"});
        }
        else{
            console.log("Success");
            res.json({Elements_Returned: Concept_Information.length, Concept_Information});
        }
    });
});

//Definition Route
app.get("/definition/CUI/:CUI", (req, res) => {
    var query = "SELECT DISTINCT DEF " +
                "FROM mrdef " +
                "WHERE CUI = \'" + req.params.CUI + "\';";

    console.log(query);

    db.query(query, (err, Definitions) => {
        if(err){
            console.log("Error retrieving Definition information");
            res.json({CUI: "CUI Does Not Exist"});
        }
        else{
            console.log("Defintion Success");

            var query = "SELECT DISTINCT STR " +
                        "FROM mrconso " +
                        "WHERE CUI = \'" + req.params.CUI + "\'" +
                        "AND LAT = \'ENG\';";

            db.query(query, (err, Terms) => {
                if(err){
                    console.log("Error retrieving String information");
                    res.json({CUI: "CUI Does Not Exist"});
                }
                else{
                    console.log("String Success");
                    res.json({Definitions_Returned: Definitions.length, Definitions, Terms_Returned: Terms.length, Terms});
                }
            });
        }
    });
});

app.listen(port,() => {
    console.log("Server running...")
});