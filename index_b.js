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
Wir muessen die Daten persistent ablegen und das ohne eine Datenbank. 
War da nichtmal was mit einem fs module? :)

    * Speicher die Eintraege in einer .json File (B)
    * Neue Eintraege muessen gespeichert werden
    * Lade die Datensaetze um sie auf der Landingpage anzuzeigen  
    * 
    * // npm install nanoid (generiert id)
*/

//-----------------------RESOURCES-----------------------------------------

const express = require("express");
app = express();
PORT = 3000;
const { body, validationResult } = require("express-validator");

const fs = require("fs");
let data = fs.readFileSync("data.json");
let myObject = JSON.parse(data);

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

// server (B)
app.get("/", (_, res) => {
  res.render("home", { user: myObject });
});

//(B)
app.post(
  "/post",

  //express-validator
  body("email").isEmail(),
  body("vorName").isLength({ min: 1 }),
  body("name").isLength({ min: 1 }),
  body("message").isLength({ min: 5 }),

  //callback function
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { error: errors.errors });
    }

    //push user-input
    const newPost = req.body;
    myObject.push(newPost);
    var newData2 = JSON.stringify(myObject, null, 2);

    //write to data.json persistent
    fs.writeFile("data.json", newData2, (err) => {
      if (err) throw err;
      console.log("New data added successfully");
    });

    //after submit redirect user to "/"
    res.redirect("/");
  }
);

//---------------------------------------------------------------------------

app.listen(PORT, () => console.log("listening on port:", PORT));
