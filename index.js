require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Blog post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    datePosted: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.json());

// Create a new blog post
app.post('/posts', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    await post.save();
    res.status(201).send(post);
});

// Get all blog posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.status(200).send(posts);
});

// Get a single blog post
app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.send(post);
});

// Update a blog post
app.put('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.send(post);
});

// Delete a blog post
app.delete('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Blog API running on http://localhost:${port}`);
});
