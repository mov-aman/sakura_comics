import express from "express";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
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

// // GET - List all Mangas
// app.get("/product", (req, res) => {
//     res.json(product.manga);
// })

app.get("/", (req, res) => {
    {
        res.send("Running...")
    }
})

//image storage engine
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

app.post('/addproduct', async (req, res) => {
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
    await product.save()
    console.log("Saved");
    res.json({
        success: 1,
        name: req.body.name,
    })
})

// api for deleting products

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: 1,
        name: req.body.name,
    })
})

// api for getting products

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All product are here");
    res.send(products);
})


// // GET - Details of a specific manga by name
// app.get("/product/:titleName", (req, res) => {
//     // Edge case: Check if product or product.manga is defined
//     if (!product || !product.manga) {
//         return res.status(500).json({ error: "Internal server error: product data structure not properly initialized" });
//     }
//     const titleName = req.params.titleName;
//     // Edge case: Check if titleName is a valid non-empty string
//     if (!titleName || typeof titleName !== 'string') {
//         return res.status(400).json({ error: "Invalid titleName parameter" });
//     }
//     // Edge case: Check if product.manga array is empty
//     if (!product.manga.length) {
//         return res.status(404).json({ error: "No manga titles found" });
//     }
//     const title = product.manga.find((c) => c.title === titleName);
//     // Edge case: Check if title is found
//     if (!title) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     res.json(title);
// });

// // GET - Average rating of a specific manga
// app.get("/product/:titleName/rating", (req, res) => {
//     // Edge case: Check if product or product.manga is defined
//     if (!product || !product.manga) {
//         return res.status(500).json({ error: "Internal server error: product data structure not properly initialized" });
//     }
//     const titleName = req.params.titleName;
//     // Edge case: Check if titleName is a valid non-empty string
//     if (!titleName || typeof titleName !== 'string') {
//         return res.status(400).json({ error: "Invalid titleName parameter" });
//     }
//     // Edge case: Check if product.manga array is empty
//     if (!product.manga.length) {
//         return res.status(404).json({ error: "No manga titles found" });
//     }
//     const title = product.manga.find((c) => c.title === titleName);
//     // Edge case: Check if title is found
//     if (!title) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     // Edge case: Check if averageRating is a valid numeric value
//     if (typeof title.averageRating !== 'number') {
//         return res.status(500).json({ error: "Internal server error: Invalid averageRating property" });
//     }
//     res.json({ averageRating: title.averageRating });
// });

// // Create a model based on the schema
// const Manga = mongoose.model("Manga", mangaSchema);

// // POST - Create a new manga
// app.post("/product", async (req, res) => {
//     try {
//         const newManga = new Manga(req.body);
//         const savedManga = await newManga.save();
//         res.status(201).json(savedManga);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" })
//     }
// });

// // POST - Add a rating for a manga
// app.post("/product/:titleName/rating", (req, res) => {
//     const title = product.manga.find((c) => c.title === req.params.titleName);
//     if (!title) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     const rating = parseFloat(req.body.rating);
//     if (isNaN(rating) || rating < 0 || rating > 5) {
//         return res.status(400).json({ error: "Invalid or missing rating value" });
//     }
//     if (title.userRated > 0) {
//         title.averageRating =
//             (title.averageRating * title.userRated + rating) /
//             (title.userRated + 1);
//         title.userRated++;
//         res.json({ message: "Rating updated", newAverageRating: title.averageRating });
//     } else {
//         res.status(500).json({ error: "Unexpected error in calculating average rating" });
//     }
// });

// // PUT - Modify information of a manga
// app.put("/product/:titleName", (req, res) => {
//     // Edge case: Check if product or product.manga is defined
//     if (!product || !product.manga) {
//         return res.status(500).json({ error: "Internal server error: product data structure not properly initialized" });
//     }
//     const titleName = req.params.titleName;
//     // Edge case: Check if titleName is a valid non-empty string
//     if (!titleName || typeof titleName !== 'string') {
//         return res.status(400).json({ error: "Invalid titleName parameter" });
//     }
//     // Edge case: Check if product.manga array is empty
//     if (!product.manga.length) {
//         return res.status(404).json({ error: "No manga titles found" });
//     }
//     const index = product.manga.findIndex((c) => c.title === titleName);
//     // Edge case: Check if title is found
//     if (index === -1) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     // Edge case: Check if req.body is an object
//     if (typeof req.body !== 'object' || req.body === null) {
//         return res.status(400).json({ error: "Invalid request body. Expected an object" });
//     }
//     // Update the title with the properties from req.body
//     product.manga[index] = { ...product.manga[index], ...req.body };
//     res.send("Title updated");
// });

// // PATCH - Update partial information of a manga
// app.patch("/product/:titleName", (req, res) => {
//     // Edge case: Check if product or product.manga is defined
//     if (!product || !product.manga) {
//         return res.status(500).json({ error: "Internal server error: product data structure not properly initialized" });
//     }
//     const titleName = req.params.titleName;
//     // Edge case: Check if titleName is a valid non-empty string
//     if (!titleName || typeof titleName !== 'string') {
//         return res.status(400).json({ error: "Invalid titleName parameter" });
//     }
//     // Edge case: Check if product.manga array is empty
//     if (!product.manga.length) {
//         return res.status(404).json({ error: "No manga titles found" });
//     }
//     const index = product.manga.findIndex((c) => c.title === titleName);
//     // Edge case: Check if title is found
//     if (index === -1) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     // Edge case: Check if req.body is an object
//     if (typeof req.body !== 'object' || req.body === null) {
//         return res.status(400).json({ error: "Invalid request body. Expected an object" });
//     }
//     const titleToUpdate = product.manga[index];
//     // Update specific fields if they exist in the request body
//     if (req.body.author !== undefined) titleToUpdate.author = req.body.author;
//     if (req.body.volumes !== undefined) titleToUpdate.volumes = req.body.volumes;
//     if (req.body.ongoing !== undefined) titleToUpdate.ongoing = req.body.ongoing;

//     res.send("Product partially updated");
// });

// // DELETE - Remove a manga by name
// app.delete("/product/:titleName", (req, res) => {
//     // Edge case: Check if product or product.manga is defined
//     if (!product || !product.manga) {
//         return res.status(500).json({ error: "Internal server error: product data structure not properly initialized" });
//     }
//     const titleName = req.params.titleName
//     // Edge case: Check if titleName is a valid non-empty string
//     if (!titleName || typeof titleName !== 'string') {
//         return res.status(400).json({ error: "Invalid titleName parameter" });
//     }
//     // Edge case: Check if product.manga array is empty
//     if (!product.manga.length) {
//         return res.status(404).json({ error: "No manga titles found" });
//     }
//     const index = product.manga.findIndex((c) => c.title === titleName);
//     // Edge case: Check if title is found
//     if (index === -1) {
//         return res.status(404).json({ error: "Title not found" });
//     }
//     // Perform the deletion
//     product.manga.splice(index, 1);
//     res.send("Manga title deleted");
// });

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
});
