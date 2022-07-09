// Aufgabe

/*
Kunde:
“
    *Ich moechte ein Gaestebuch auf meiner Seite haben. 
    So koennen auch, nicht registrierte Besucher, an der Seite teilnehmen. 
    *Das wichtige dabei ist, dass die Daten Valide sind. 
    *Ich brauche den 
        * Vornamen, 
        * Nachnamen, 
        * Emailadresse 
        * Nachricht.”
*/

// Plan

/*
    * Baue dir einen Server mit Express.js
    * Nutzte EJS fuer dein Frontend
    * Validiere die Daten mit dem express-validator
    * Speicher die Eintraege in einem globalen Array (A) +---> index.js

Wir muessen die Daten persistent ablegen und das ohne eine Datenbank. 
War da nichtmal was mit einem fs module? :)

    * Speicher die Eintraege in einer .json File (B) +---> index_b.js
    * Neue Eintraege muessen gespeichert werden
    * Lade die Datensaetze um sie auf der Landingpage anzuzeigen  
    
*/

//-----------------------RESOURCES-----------------------------------------

const express = require("express");
app = express();
PORT = 3000;
const { body, validationResult } = require("express-validator");

//---------------------------------------------------------------------------

//Globales Array (A)
const usersArray = [];

//---------------------------------------------------------------------------

// specify default engine
app.set("view engine", "ejs");

// um application/json zu parsen
app.use(express.json());

// um application/x-www-form-urlencoded zu parsen
app.use(express.urlencoded({ extended: true }));

//middleware
app.use((req, res, next) => {
  console.log("Hi, from middleware", req.method, req.url);
  next();
});

app.use(express.static("public"));

//--------------------------------(A)-------------------------------------------

// server(A);
app.get("/", (_, res) => {
  console.log("home works");
  res.render("home", { user: usersArray });
});

app.post(
  "/post",
  body("email").isEmail(),
  body("vorName").isLength({ min: 1 }),
  body("name").isLength({ min: 1 }),
  body("message").isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { error: errors.errors });
    }
    const newPost = req.body;
    usersArray.push(newPost);
    res.redirect("/");
  }
);

//---------------------------------------------------------------------------

app.listen(PORT, () => console.log("listening on port:", PORT));
