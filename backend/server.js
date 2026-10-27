const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/contact.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ===============================
// GET ALL CONTACTS
// ===============================
app.get("/api/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.json(contacts);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching contacts"
        });
    }
});


// ===============================
// GET SINGLE CONTACT
// ===============================
app.get("/api/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching contact"
        });
    }
});


// ===============================
// ADD CONTACT
// ===============================
app.post("/api/contacts", async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const contact = new Contact({
            name,
            email,
            phone,
            address
        });

        const savedContact = await contact.save();

        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({
            message: "Error adding contact",
            error: error.message
        });
    }
});


// ===============================
// UPDATE CONTACT
// ===============================
app.put("/api/contacts/:id", async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                address
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({
            message: "Error updating contact",
            error: error.message
        });
    }
});


// ===============================
// DELETE CONTACT
// ===============================
app.delete("/api/contacts/:id", async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(
            req.params.id
        );

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting contact"
        });
    }
});


// Test route
app.get("/", (req, res) => {
    res.send("Contact Management API is running");
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});