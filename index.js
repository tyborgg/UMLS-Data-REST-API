const express = require("express");
const db = require("./mysqlConnection");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

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

    db.query(query, (err, Definitions) => {
        if(err){
            console.log("Error retrieving Definition information");
            res.json({Definition: "Definition Does Not Exist"});
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
                    res.json({Term: "Term Does Not Exist"});
                }
                else{
                    console.log("String Success");
                    res.json({Definitions_Returned: Definitions.length, Definitions, Terms_Returned: Terms.length, Terms});
                }
            });
        }
    });
});

//Relations Route
app.get("/relation/CUI/:CUI", (req, res) => {
    var query = "SELECT DISTINCT r.CUI2 AS CUI1, r.AUI2 AS AUI1, c2.STR AS STR1, r.RELA, r.CUI1 AS CUI2, r.AUI1 AS AUI2, c1.STR AS STR2, r.REL " +
                "FROM mrrel r, mrconso c1, mrconso c2 " +
                "WHERE r.CUI2 = \'" + req.params.CUI + "\' " +
                "AND r.AUI1 = c1.AUI " +
                "AND r.AUI2 = c2.AUI;";

    db.query(query, (err, Relations) => {
        if(err){
            console.log("Error retrieving Definition information");
            res.json({Relation: "Relation Does Not Exist"});
        }
        else{
            console.log("Relation Success");
            res.json({Relations_Returned: Relations.length, Relations})
        }
    });
});

app.listen(port,() => {
    console.log("Server running...")
});