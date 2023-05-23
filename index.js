const express = require("express");
const db = require("./mysqlConnection");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

db.connect((err) => {
    if(err) console.log(err);
    else console.log("MySQL DB Connected");
});

//Concept Route
app.get("/concept/CUI/:CUI", (req, res) => {
    var query = "SELECT * " +
                "FROM mrconso " +
                "WHERE CUI = \'" + req.params.CUI + "\';";

    db.query(query, (err, Concept) => {
        if(err){
            console.log("Error retrieving CUI information");
            res.json({CUI: "CUI Does Not Exist"});
        }
        else{
            console.log("Concept Success");
            res.json({Elements_Returned: Concept.length, Concept});
        }
    });
});

//Definition Route (CUI Input)
app.get("/definition/CUI/:CUI", (req, res) => {
    var query = "SELECT DISTINCT DEF " +
                "FROM mrdef " +
                "WHERE CUI = \'" + req.params.CUI + "\';";

    db.query(query, (err, Definitions) => {
        if(err){
            console.log("Error retrieving Definition information");
            res.json({Definition: "Definitions Do Not Exist For " + req.params.CUI});
        }
        else{
            console.log("Definition Success");

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

//Definition Route (String Input)
app.get("/definition/term/:input", cors(), (req, res) => {
    var query = "SELECT DISTINCT d.CUI, d.AUI, d.SAB, c.STR, d.DEF " +
                    "FROM MRDEF d, MRCONSO c " +
                    "WHERE d.CUI IN (SELECT DISTINCT CUI " +
                                "FROM MRCONSO " +
                                "WHERE STR = \'" + req.params.input + "\' " +
                                "AND ISPREF = \'Y\') " + 
                    "AND d.AUI = c.AUI " +
                    "AND d.CUI = c.CUI";

    console.log(req.params.input)

    db.query(query, (err, Definitions) => {
        if(err){
            console.log("Error retrieving Definition information");
            res.json({Definitions_Returned: 0});
        }
        else{
            console.log("Definition Success");
            res.json({Definitions_Returned: Definitions.length, Definitions})
        }
    });
});

//Relations Route (CUI input)
app.get("/relation/CUI/:CUI", (req, res) => {
    var query = "SELECT DISTINCT r.CUI2 AS CUI1, r.AUI2 AS AUI1, c2.STR AS STR1, r.RELA, r.CUI1 AS CUI2, r.AUI1 AS AUI2, c1.STR AS STR2, r.REL " +
                "FROM mrrel r, mrconso c1, mrconso c2 " +
                "WHERE r.CUI2 = \'" + req.params.CUI + "\' " +
                "AND r.AUI1 = c1.AUI " +
                "AND r.AUI2 = c2.AUI " + 
                "AND r.RELA IS NOT NULL " +
                "LIMIT 5;";

    db.query(query, (err, Relations) => {
        if(err){
            console.log("Error retrieving Relation information");
            res.json({Relation: "Relations Do Not Exist For " + req.params.CUI});
        }
        else{
            console.log("Relation Success");
            res.json({Relations_Returned: Relations.length, Relations})
        }
    });
});

//Relations Route (AUI input)
app.get("/relation/AUI/:AUI", (req, res) => {
    var query = "SELECT DISTINCT r.CUI2 AS CUI1, r.AUI2 AS AUI1, c2.STR AS STR1, r.RELA, r.CUI1 AS CUI2, r.AUI1 AS AUI2, c1.STR AS STR2, r.REL " +
                "FROM mrrel r, mrconso c1, mrconso c2 " +
                "WHERE r.AUI2 = \'" + req.params.AUI + "\' " +
                "AND r.AUI1 = c1.AUI " +
                "AND r.AUI2 = c2.AUI " + 
                "AND r.RELA IS NOT NULL " +
                "LIMIT 5;";

    db.query(query, (err, Relations) => {
        if(err){
            console.log("Error retrieving Relation information");
            res.json({Relation: "Relations Do Not Exist For " + req.params.AUI});
        }
        else{
            console.log("Relation Success");
            res.json({Relations_Returned: Relations.length, Relations})
        }
    });
});

//Relations Route (String Input)
app.get("/relation/term/:input", (req, res) => {
    var query = "SELECT DISTINCT r.CUI2 AS CUI1, r.AUI2 AS AUI1, c2.STR AS STR1, r.RELA, r.CUI1 AS CUI2, r.AUI1 AS AUI2, c1.STR AS STR2, r.REL " +
                "FROM mrrel r, mrconso c1, mrconso c2 " +
                "WHERE CUI2 IN (SELECT DISTINCT CUI " +
                                "FROM mrconso " +
                                "WHERE STR = \'" + req.params.input + "\' " +
                                "AND ISPREF = 'Y') " +
                "AND r.AUI1 = c1.AUI " +
                "AND r.AUI2 = c2.AUI " +
                "AND c2.STR = \'" + req.params.input + "\' " +
                "AND r.RELA IS NOT NULL " +
                "LIMIT 50;";

    db.query(query, (err, Relations) => {
        if(err){
            console.log("Error retrieving Relation information");
            res.json({Relation: "Relation Do Not Exist For " + req.params.input});
        }
        else{
            console.log("Relation Success");
            res.json({Relations_Returned: Relations.length, Relations})
        }
    });
});

//May_Treat Route
app.get("/may_treat/CUI/:CUI", (req, res) => {
    var query = "SELECT DISTINCT r.CUI2 AS CUI1, r.AUI2 AS AUI1, c2.STR AS STR1, r.RELA, r.CUI1 AS CUI2, r.AUI1 AS AUI2, c1.STR AS STR2, r.REL " +
                "FROM mrrel r, mrconso c1, mrconso c2 " +
                "WHERE r.CUI2 = \'" + req.params.CUI + "\' " +
                "AND r.AUI1 = c1.AUI " +
                "AND r.AUI2 = c2.AUI " +
                "AND r.RELA = \'may_treat\';";

    db.query(query, (err, Relations_May_Treat) => {
        if(err){
            console.log("Error retrieving Relation information");
            res.json({Relation: "May_Treat Relations Do Not Exist For " + req.params.CUI});
        }
        else{
            console.log("Relations_May_Treat Success");
            res.json({Relations_May_Treat_Returned: Relations_May_Treat.length, Relations_May_Treat});
        }
    });
});

app.listen(port,() => {
    console.log("Server running...")
});