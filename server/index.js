import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
const app = express()
const port = 5000;

app.use(express.json());
app.use(cors());

//Database connection with MondoDB
mongoose.connect("mongodb+srv://putin:VYDnhdQllH3F37GA@cluster0.klv3svi.mongodb.net/e-commerce")

  .then(() => console.log("MongoDB connected…"))
  .catch((err) => console.log(err));

// GET - List all Mangas
// app.get("/product", (req, res) => {
//     res.json(product.manga);
// })

app.get("/", (req, res) => {
  {
    res.send("Running...")
  }
})

// image storage engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({ storage: storage })

// creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
})

// Schema for creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// API for adding products
app.post('/addproduct', async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);  //get the last product
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
      success: 1,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error during product addition:", error);
    res.status(500).json({ success: 0, error: "Internal Server Error" });
  }
});

// API for updating products using PATCH request
app.patch('/updateproduct', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
          category: req.body.category,
          new_price: req.body.new_price,
          old_price: req.body.old_price,
        }
      },
      { new: true }
    );
    console.log("Updated");
    res.json({
      success: 1,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error during product update:", error);
    res.status(500).json({ success: 0, error: "Internal Server Error" });
  }
});

// API for updating products using PUT request
app.put('/replaceproduct/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndReplace(
      { id: req.params.id },
      {
        id: req.params.id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
      },
      { new: true }
    );
    console.log("Replaced");
    res.json({
      success: 1,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error during product replacement:", error);
    res.status(500).json({ success: 0, error: "Internal Server Error" });
  }
});

// API for deleting products
app.delete('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: 1,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ success: 0, error: "Internal Server Error" });
  }
});

// api for getting all products

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All product are here");
  res.send(products);
})

//schema for user interaction

const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

//crating api for creating users

app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing user" })
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  })

  await user.save(); //saving the data is mangodb

  const data = {
    user: {
      id: user.id
    }
  }
  const token = jwt.sign(data, 'secret_ecom');
  res.json({success: true, token})
})

// api for user login

app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      //jwt token
      const token = jwt.sign(data,'secret_ecom');
      res.json({ success: true, token });
    }
    else {
      res.json({ success: false, errors: "Wrong password" })
    }
  }
  else {
    res.json({ success: false, errors: "Wrong email" })
  }
})

//api for newcollections

app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("newcollection");
  res.send(newcollection);
})

// api for popular new Releases

app.get('/popularnewrelease', async (req, res) => {
  let products = await Product.find({category: 'newRelease'});
  let popularnew = products.slice(0,4);
  console.log("popularnew");
  res.send(popularnew);
})


// app.get("/*", (req, res) => {
//     const possibleRoutes = [
//         "/product",
//         "/product/:titleName",
//         "/product/:titleName/rating",
//         // Add other routes as needed
//     ];
//     const message = `You are on the wrong route. Here's the list of possible routes:\n${possibleRoutes.join("\n")}`;
//     res.send(message);
//     console.log("You are on a invalid route:", req.path);
// });

app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  }
  else {
    console.log("Error :" + error);
  }
})
