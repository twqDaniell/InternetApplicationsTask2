const postModel = require("../models/posts_model");

const getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await postModel.findById(postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

const createPost = async (req, res) => {
  const newPost = new postModel(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllPosts = async (req, res) => {
  const filter = req.query.sender;
  
  try {
    if (filter) {
      const posts = await postModel.find({ sender: filter });
      res.send(posts);
    } else {
      const posts = await postModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, { new: true });
    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { 
  getPostById, 
  createPost, 
  getAllPosts, 
  updatePost 
};
