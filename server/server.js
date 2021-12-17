const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const crypto = require("crypto");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const { MONGO_URL, APP_PORT } = process.env;
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const path = require("path");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Create mongo connection
const conn = mongoose.createConnection(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to database")
);

// init gfs
let gfs;

conn.once("open", () => {
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection("postImages");
  gfs.collection("Images");
});

// create storage engine
const fsStorage = new GridFsStorage({
  url: MONGO_URL,
  file: (req, file) => {
    console.log("here", req.query);
    const { username, type } = req.query;

    let name = username + Date.now() + path.extname(file.originalname);
    let filename;
    let isProfile = false;
    let isCover = false;
    let isPost = false;

    if (type == "post") {
      filename = "post." + name;
      isPost = true;
    } else if (type == "profile") {
      filename = "profile." + name;
      isProfile = true;
    } else {
      filename = "cover." + name;
      isCover = true;
    }

    return {
      filename,
      bucketName: "Images",
      metadata: {
        type: req.query.type,
        originalname: file.originalname,
        username,
        isProfile,
        isCover,
        isPost,
      },
    };
  },
});

const fsUpload = multer({ storage: fsStorage });

app.use("/images", express.static(path.join(__dirname, "public/images")));

// just commented
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, req.body.name);
//   },
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
// });

// const upload = multer({ storage });

app.post("/api/upload", fsUpload.single("file"), async (req, res) => {
  try {
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a single image
app.get("/api/image/:imageId", (req, res) => {
  const image = gfs.files.findOne({ _id: req.params.imageId });

  return res.status(200).json(image);
});

// Get all post or profile or cover images of a perticular user
app.get("/api/images", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    let results = files.filter(
      (file) => file.metadata.username == req.query.username
    );

    return res.status(200).json(results);
    // };
  });
});

// Display a single image
app.get("/api/image/view/:filename", async (req, res) => {
  let image = await gfs.files.findOne({ filename: req.params.filename });

  // Check if image
  if (image.contentType === "image/jpeg" || image.contentType === "img/png") {
    // To Download the image
    // const readstream = gfs.createReadStream({
    //   filename: results[0].filename,
    // });
    // readstream.pipe(res);

    // To display image to browser
    var rstream = gfs.createReadStream({ filename: image.filename });
    var bufs = [];
    rstream
      .on("data", function (chunk) {
        bufs.push(chunk);
      })
      .on("end", function () {
        // done

        var fbuf = Buffer.concat(bufs);

        var base64 = fbuf.toString("base64");

        return res.send('<img src="data:image/jpeg;base64,' + base64 + '">');
      });
  } else {
    return res.status(404).json({
      err: "Not an image",
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(APP_PORT, () => console.log(`Server started on port ${APP_PORT}`));
