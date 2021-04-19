/**
 * File: app.js
 * This file uses: express as middleware between React and a MongoDb Atlas
 * Information is sent,stored, updated, and deleted through POST,GET, and PUT
 * requests to Mongodb Atlas collection
 */

/*Express Intergration */
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const CONNECTION_URL =
  "mongodb+srv://antarma:pgSrCM0edyk4EQfU@cluster0.cgw0j.mongodb.net/seniordesign?retryWrites=true&w=majority";
const DATABASE_NAME = "seniordesign";

let nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user: "achievenowapp@gmail.com", pass: "Bluelemon234" },
}); 


/*create the express app */
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
var database, collection;
let oldGrades;
/*Connect to mongo databse called student_grades on port 3012 */
app.listen(3012, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("student_grades");
      console.log("Connected to `" + DATABASE_NAME + "`!");

      collection.find({}).toArray((error, result) => {
        if (error) {
          return response.status(500).send(error);
        }
        console.log(result[0].data);
        oldGrades = result;
      });
    }
  );
});

app.post("/sendEmails", (req, res) => {
  const receivers = req.body.emailList.join(",").trim();
  console.log(receivers);
  var mailOptions = {
    from: "achievenowapp@gmail.com",
    to: receivers,
    subject: "Sign Up with Achieve Now!",
    text: "Go to achieve-now to sign up with your email!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}); 

/* route handler to get data from a collection called data in mongo */
app.get("/getData", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

app.get("/getProfile", (request, response) => {
  collection = database.collection("profile");

  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

app.post("/insertIntoProfile", (req, res) => {
  const body = req.body.profileTable;

  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("profile");
      classCollection.update({}, { $set: { profileTable: [] } }, (err, obj) => {
        if (err) {
          return res.status(500).send(error);
        }
      });
      collection = database.collection("profile");
      body.forEach((dataPiece) => {
        collection.updateOne(
          {},
          { $push: { profileTable: dataPiece } },
          (error, obj) => {
            if (error) {
              return res.status(500).send(error);
            }
          }
        );
      });
    }
  );
});
app.get("/getRegisteredUsers", (request, response) => {
  collection = database.collection("authorized_invitees");
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result[0].users);
  });
});

app.post("/registerUser", (req, res) => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("authorized_invitees");
      collection.updateOne(
        {},
        { $addToSet: { users: req.body.userEmail } },
        (error, obj) => {
          if (error) {
            return res.status(500).send(error);
          }
          res.send(
            `added ${req.body.userEmail} to the list of authorized users to registers`
          );
        }
      );
    }
  );
});



/*POST request to send student grades to student_grades collection*/
app.post("/updateStudentsGrades", (req, res) => {
  const body = req.body.data;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("student_grades");
      classCollection.update({}, { $set: { data: [] } }, (err, obj) => {
        if (err) {
          return res.status(500).send(error);
        }
      });
      collection = database.collection("student_grades");
      body.forEach((dataPiece) => {
        collection.updateOne(
          {},
          { $push: { data: dataPiece } },
          (error, obj) => {
            if (error) {
              return res.status(500).send(error);
            }
          }
        );
      });
    }
  );
  return res.send("students Grades Updated");
});

/*RGET request to get data from the student_grades collection  */
app.get("/getBookFromGradebook", (req, res) => {
  collection = database.collection("student_grades");
  collection.find({}).toArray((error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result[0].data);
  });
});

/* POST request to send data to mongo  */
app.post("/addChildToParent", (req, res) => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("student_grades");

      const child = {
        firstName: req.body.data.childFirstName,
        lastName: req.body.data.childLastName,
        parentEmail: req.body.data.emailAddress,
        id: req.body.data.id,
        modules: {},
      };
      console.log(oldGrades);

      oldGrades.push(child);
      console.log(child);
      classCollection = database.collection("student_grades");

      classCollection.update({}, { $set: { data: [] } }, (err, obj) => {
        if (err) {
          return response.status(500).send(error);
        }
      });
      console.log(oldGrades);
      oldGrades[0] = null;
      oldGrades = oldGrades.filter((data) => data);
      oldGrades.forEach((dataPiece) => {
        collection.updateOne(
          {},
          { $push: { data: dataPiece } },
          (error, obj) => {
            if (error) {
              return res.status(500).send(error);
            }
          }
        );
      });
    }
  );
});

/*GET request to gets data from the reading_data collection */
app.get("/getReadingData", (request, response) => {
  const readingCollection = database.collection("reading_data");

  readingCollection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

/* GET request to get data on from class_data collection */
app.get("/getClassData", (request, response) => {
  const classCollection = database.collection("class_data");

  classCollection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

app.get("/getLessons", (request, response) => {
  collection = database.collection("lessons");
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
}); 


app.get("/getLessonHistory", (request, response) => {
  const classCollection = database.collection("lesson_history");

  classCollection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result[0].lessonHistory);
  });
});

app.post("/addLessonHistory", (request, response) => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("lesson_history");
      collection.updateOne(
        {},
        { $push: { lessonHistory: request.body } },
        (error, obj) => {
          if (error) {
            return response.status(500).send(error);
          }
          response.send("added lesson history");
        }
      );
    }
  );
});

app.post("/addLessonHistoryToStudent", (request, response) => {
  let classCollection;

  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("lesson_history");
      classCollection.update(
        {},
        { $set: { lessonHistory: [] } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
        }
      );

      classCollection.update(
        {},
        { $set: { lessonHistory: request.body } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("updated the reading site students!");
        }
      );
    }
  );
});
/* POST request to send data to reading_data collection */
app.post("/createReadingSite", (request, response) => {
  const body = {
    siteName: request.body.siteName,
    students: [
      {
        id: request.body.id,
        studentName: "",
        coachName: "",
        lessonNumber: "",
        notes: "",
      },
    ],
  };
  let readingCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      readingCollection = database.collection("reading_data");
      readingCollection.updateOne(
        {},
        { $push: { data: body } },
        (error, obj) => {
          if (error) {
            return response.status(500).send(error);
          }
          response.send("created new site!");
        }
      );
    }
  );
});

/*POST request to send created class site data to class_data collection */
app.post("/createClassSite", (request, response) => {
  const body = {
    siteName: request.body.siteName,
    students: [
      {
        id: request.body.id,
        studentName: "",
        coachName: "",
        lessonNumber: "",
        rs: "",
        teacher: "",
        core: "",
        cert_check: "",
        dra: "",
        gle: "",
      },
    ],
  };
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("class_data");
      classCollection.updateOne({}, { $push: { data: body } }, (error, obj) => {
        if (error) {
          return response.status(500).send(error);
        }
        response.send("created new site!");
      });
    }
  );
});

app.post("/addLesson", (req, res) => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("lessons");
      collection.updateOne(
        {},
        { $push: { lessonArr: req.body } },
        (error, obj) => {
          if (error) {
            return res.status(500).send(error);
          }
          res.send("added lesson");
        }
      );
    }
  );
});
// app.delete("/deleteClassSite", (request, response) => {
//   let classCollection;
//   MongoClient.connect(
//     CONNECTION_URL,
//     { useNewUrlParser: true },
//     (error, client) => {
//       if (error) {
//         throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       classCollection = database.collection("class_data");
//       classCollection.update(
//         {},
//         { $pull: { data: { siteName: "henrico" } } },
//         { multi: true },
//         (err, obj) => {
//           if (err) {
//             return response.status(500).send(error);
//           }
//           response.send("deleted the site!");
//         }
//       );
//     }
//   );
// });

// app.put("/addToSite", (request, response) => {
//   let classCollection;
//   const data = {
//     id: "",
//     studentName: "",
//     coachName: "",
//     lessonNumber: "",
//     rs: "",
//     teacher: "",
//     core: "",
//     cert_check: "",
//     dra: "",
//     gle: "",
//   };
//   MongoClient.connect(
//     CONNECTION_URL,
//     { useNewUrlParser: true },
//     (error, client) => {
//       if (error) {
//         throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       classCollection = database.collection("class_data");
//       classCollection.update(
//         { "data.siteName": "ali" },edit
//     }
//   );
// });

// app.put("/removeClassSite", (request, response) => {
//   let classCollection;
//   MongoClient.connect(
//     CONNECTION_URL,
//     { useNewUrlParser: true },
//     (error, client) => {
//       if (error) {
//         throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       classCollection = database.collection("class_data");
//       classCollection.update(
//         { "data.siteName": "ali" },
//         { $pull: { "data.$.students": { id: "222" } } },
//         (err, obj) => {
//           if (err) {
//             return response.status(500).send(error);
//           }
//           response.send("deleted the site!");
//         }
//       );
//     }
//   );
// });

app.put("/updateStudentsInClassSite", (request, response) => {
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("class_data");
      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $set: { "data.$.students": [] } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
        }
      );

      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $set: { "data.$.students": request.body.data } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("update the site!");
        }
      );
    }
  );
});

// app.put("/updateToStudentsInSite", (request, response) => {
//   let classCollection;
//   const data = {
//     id: "",
//     studentName: "",
//     coachName: "",
//     lessonNumber: "",
//     rs: "",
//     teacher: "",
//     core: "",
//     cert_check: "",
//     dra: "",
//     gle: "",
//   };
//   MongoClient.connect(
//     CONNECTION_URL,
//     { useNewUrlParser: true },
//     (error, client) => {
//       if (error) {
//         throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       classCollection = database.collection("class_data");
//       classCollection.update(
//         { "data.siteName": "tayeh" },
//         // { $pull: { "data.$.students": { id: "222" } } },
//         { $set: { "data.$.students.0.id": "1111" } },
//         (err, obj) => {
//           if (err) {
//             return response.status(500).send(errsor);
//           }
//           response.send("updated the site!");
//         }
//       );
//     }
//   );
// });

app.post("/addStudentToSite", (request, response) => {
  // let classCollection;
  const data = {
    id: request.body.id.toString(),
    studentName: "",
    coachName: "",
    lessonNumber: "",
    rs: "",
    teacher: "",
    core: "",
    cert_check: "",
    dra: "",
    gle: "",
  };
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME); // pointing to database
      classCollection = database.collection("class_data"); // point ot collection
      classCollection.update(
        //push/update data into the collection
        { "data.siteName": request.body.siteName }, //point to target object to push/udate data
        { $push: { "data.$.students": data } }, //pointing to array students, and adding data
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("added the student to the site!");
        }
      );
    }
  );
});

app.post("/addStudentToReadingSite", (request, response) => {
  // let classCollection;
  const data = {
    id: request.body.id.toString(),
    studentName: "",
    coachName: "",
    notes: "",
  };
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME); // pointing to database
      classCollection = database.collection("reading_data"); // point ot collection
      classCollection.update(
        //push/update data into the collection
        { "data.siteName": request.body.siteName }, //point to target object to push/udate data
        { $push: { "data.$.students": data } }, //pointing to array students, and adding data
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("added the student to the site!");
        }
      );
    }
  );
});

app.post("/removeStudentInSite", (request, response) => {
  let classCollection;

  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("class_data");
      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $pull: { "data.$.students": { id: request.body.id } } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("removed the student from the site!");
        }
      );
    }
  );
});

app.post("/removeStudentFromGradebook", (request, response) => {
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("student_grades");
      classCollection.update(
        { "data.id": +request.body.id },
        { $pull: { "data.$.modules": { id: +request.body.id } } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("removed the student from the gradebook!");
        }
      );
    }
  );
});
app.post("/removeStudentInReading", (request, response) => {
  let classCollection;

  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("reading_data");
      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $pull: { "data.$.students": { id: request.body.id } } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("removed the student from the reading site!");
        }
      );
    }
  );
});

app.put("/updateStudentsInReadingSite", (request, response) => {
  let classCollection;

  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("reading_data");
      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $set: { "data.$.students": [] } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
        }
      );

      classCollection.update(
        { "data.siteName": request.body.siteName },
        { $set: { "data.$.students": request.body.data } },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("updated the reading site students!");
        }
      );
    }
  );
});
