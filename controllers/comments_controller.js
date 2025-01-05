const commentsModel = require("../models/comments_model");

const createComment = async (req, res) => {
  const newComment = new commentsModel(req.body);

  try {
    const savedComment = await newComment.save();
    res.status(201).send(savedComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const updateData = req.body;

  try {
    const updatedComment = await commentsModel.findByIdAndUpdate(commentId, updateData, { new: true });
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    await commentsModel.findByIdAndDelete(commentId);
    res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllComments = async (req, res) => {
    const postFilter = req.query.postId;

    console.log(postFilter);
    

    try {
      if (postFilter) {
        const comments = await commentsModel.find({ postId: postFilter });
        res.send(comments);
      } else {
        const comments = await commentsModel.find();
        res.send(comments);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
};

const getCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await commentsModel.findById(commentId);
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentById
};