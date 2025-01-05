import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentsModel, { IComment } from "../models/comments_model";

import testCommentsData from "./test_comments.json";
import { Express } from "express";

let app: Express;

type Comment = {
  _id?: string;
  message: string;
  postId: string;
  user: string;
  createdAt?: Date;
}

const testComments: Comment[] = testCommentsData.map(comment => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
  }));

const baseUrl = "/comments";

beforeAll(async () => {
  console.log("Before all tests");
  app = await appInit();
  await commentsModel.deleteMany();
});

afterAll(async () => {
  console.log("After all tests");
  await commentsModel.deleteMany();
  mongoose.connection.close();
});

describe("Comments Test", () => {
  test("Test get all comments empty", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test create new comment", async () => {
    for (let comment of testComments) {
      const response = await request(app).post(baseUrl).send(comment);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe(comment.message);
      expect(response.body.postId).toBe(comment.postId);
      expect(response.body.user).toBe(comment.user);
      comment._id = response.body._id;
    }
  });

  test("Test get all comments", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(testComments.length);
  });

  test("Test get comment by id", async () => {
    const response = await request(app).get(baseUrl + "/" + testComments[0]._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(testComments[0]._id);
  });

  test("Test filter commments by user", async () => {
    const response = await request(app).get(baseUrl + "?user=" + testComments[0].user
    );

    console.log(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test Delete comment", async () => {
    const response = await request(app).delete(baseUrl + "/" + testComments[0]._id);
    expect(response.statusCode).toBe(200);

    const responseGet = await request(app).get(baseUrl + "/" + testComments[0]._id);
    expect(responseGet.statusCode).toBe(404);
  });

  test("Test create new comment fail", async () => {
    const response = await request(app).post(baseUrl).send({
      title: "Test Comment 1",
      content: "Test Content 1",
    });
    expect(response.statusCode).toBe(400);
  });
});
