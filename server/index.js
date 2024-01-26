import express from "express";
import mongoose from "mongoose";
const app = express()
const port = 5000;

app.use(express.json());

//Database connection with MondoDB
mongoose.connect("mongodb+srv://putin:VYDnhdQllH3F37GA@cluster0.klv3svi.mongodb.net/e-commerce")

    .then(() => console.log("MongoDB connected…"))
    .catch((err) => console.log(err));

// GET - List all Mangas
app.get("/products", (req, res) => {
    res.json(products.manga);
})

// GET - Details of a specific manga by name
app.get("/products/:titleName", (req, res) => {
    // Edge case: Check if products or products.manga is defined
    if (!products || !products.manga) {
        return res.status(500).json({ error: "Internal server error: Products data structure not properly initialized" });
    }
    const titleName = req.params.titleName;
    // Edge case: Check if titleName is a valid non-empty string
    if (!titleName || typeof titleName !== 'string') {
        return res.status(400).json({ error: "Invalid titleName parameter" });
    }
    // Edge case: Check if products.manga array is empty
    if (!products.manga.length) {
        return res.status(404).json({ error: "No manga titles found" });
    }
    const title = products.manga.find((c) => c.title === titleName);
    // Edge case: Check if title is found
    if (!title) {
        return res.status(404).json({ error: "Title not found" });
    }
    res.json(title);
});

// GET - Average rating of a specific manga
app.get("/products/:titleName/rating", (req, res) => {
    // Edge case: Check if products or products.manga is defined
    if (!products || !products.manga) {
        return res.status(500).json({ error: "Internal server error: Products data structure not properly initialized" });
    }
    const titleName = req.params.titleName;
    // Edge case: Check if titleName is a valid non-empty string
    if (!titleName || typeof titleName !== 'string') {
        return res.status(400).json({ error: "Invalid titleName parameter" });
    }
    // Edge case: Check if products.manga array is empty
    if (!products.manga.length) {
        return res.status(404).json({ error: "No manga titles found" });
    }
    const title = products.manga.find((c) => c.title === titleName);
    // Edge case: Check if title is found
    if (!title) {
        return res.status(404).json({ error: "Title not found" });
    }
    // Edge case: Check if averageRating is a valid numeric value
    if (typeof title.averageRating !== 'number') {
        return res.status(500).json({ error: "Internal server error: Invalid averageRating property" });
    }
    res.json({ averageRating: title.averageRating });
});

// Schema for creating Products
const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    genre: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        required: true,
    },
    volumes: {
        type: Number,
        required: true,
    },
    ongoing: {
        type: Boolean,
        default: false,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    userRated: {
        type: Number,
        default: 0,
    },
});

// Create a model based on the schema
const Manga = mongoose.model("Manga", mangaSchema);

// POST - Create a new manga
app.post("/products", async (req, res) => {
    try {
        const newManga = new Manga(req.body);
        const savedManga = await newManga.save();
        res.status(201).json(savedManga);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
});

// POST - Add a rating for a manga
app.post("/products/:titleName/rating", (req, res) => {
    const title = products.manga.find((c) => c.title === req.params.titleName);
    if (!title) {
        return res.status(404).json({ error: "Title not found" });
    }
    const rating = parseFloat(req.body.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ error: "Invalid or missing rating value" });
    }
    if (title.userRated > 0) {
        title.averageRating =
            (title.averageRating * title.userRated + rating) /
            (title.userRated + 1);
        title.userRated++;
        res.json({ message: "Rating updated", newAverageRating: title.averageRating });
    } else {
        res.status(500).json({ error: "Unexpected error in calculating average rating" });
    }
});

// PUT - Modify information of a manga
app.put("/products/:titleName", (req, res) => {
    // Edge case: Check if products or products.manga is defined
    if (!products || !products.manga) {
        return res.status(500).json({ error: "Internal server error: Products data structure not properly initialized" });
    }
    const titleName = req.params.titleName;
    // Edge case: Check if titleName is a valid non-empty string
    if (!titleName || typeof titleName !== 'string') {
        return res.status(400).json({ error: "Invalid titleName parameter" });
    }
    // Edge case: Check if products.manga array is empty
    if (!products.manga.length) {
        return res.status(404).json({ error: "No manga titles found" });
    }
    const index = products.manga.findIndex((c) => c.title === titleName);
    // Edge case: Check if title is found
    if (index === -1) {
        return res.status(404).json({ error: "Title not found" });
    }
    // Edge case: Check if req.body is an object
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({ error: "Invalid request body. Expected an object" });
    }
    // Update the title with the properties from req.body
    products.manga[index] = { ...products.manga[index], ...req.body };
    res.send("Title updated");
});

// PATCH - Update partial information of a manga
app.patch("/products/:titleName", (req, res) => {
    // Edge case: Check if products or products.manga is defined
    if (!products || !products.manga) {
        return res.status(500).json({ error: "Internal server error: Products data structure not properly initialized" });
    }
    const titleName = req.params.titleName;
    // Edge case: Check if titleName is a valid non-empty string
    if (!titleName || typeof titleName !== 'string') {
        return res.status(400).json({ error: "Invalid titleName parameter" });
    }
    // Edge case: Check if products.manga array is empty
    if (!products.manga.length) {
        return res.status(404).json({ error: "No manga titles found" });
    }
    const index = products.manga.findIndex((c) => c.title === titleName);
    // Edge case: Check if title is found
    if (index === -1) {
        return res.status(404).json({ error: "Title not found" });
    }
    // Edge case: Check if req.body is an object
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({ error: "Invalid request body. Expected an object" });
    }
    const titleToUpdate = products.manga[index];
    // Update specific fields if they exist in the request body
    if (req.body.author !== undefined) titleToUpdate.author = req.body.author;
    if (req.body.volumes !== undefined) titleToUpdate.volumes = req.body.volumes;
    if (req.body.ongoing !== undefined) titleToUpdate.ongoing = req.body.ongoing;

    res.send("Product partially updated");
});

// DELETE - Remove a manga by name
app.delete("/product/:titleName", (req, res) => {
    // Edge case: Check if products or products.manga is defined
    if (!products || !products.manga) {
        return res.status(500).json({ error: "Internal server error: Products data structure not properly initialized" });
    }
    const titleName = req.params.titleName
    // Edge case: Check if titleName is a valid non-empty string
    if (!titleName || typeof titleName !== 'string') {
        return res.status(400).json({ error: "Invalid titleName parameter" });
    }
    // Edge case: Check if products.manga array is empty
    if (!products.manga.length) {
        return res.status(404).json({ error: "No manga titles found" });
    }
    const index = products.manga.findIndex((c) => c.title === titleName);
    // Edge case: Check if title is found
    if (index === -1) {
        return res.status(404).json({ error: "Title not found" });
    }
    // Perform the deletion
    products.manga.splice(index, 1);
    res.send("Manga title deleted");
});

app.get("/*", (req, res) => {
    const possibleRoutes = [
        "/products",
        "/products/:titleName",
        "/products/:titleName/rating",
        // Add other routes as needed
    ];
    const message = `You are on the wrong route. Here's the list of possible routes:\n${possibleRoutes.join("\n")}`;
    res.send(message);
    console.log("You are on a invalid route:", req.path);
});

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on http://localhost:${port}`);
    }
    else {
        console.log("Error :" + error);
    }
});
