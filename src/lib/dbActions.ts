'use client';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//creates a new user
export const createUser = async (data: any) => {
  return await prisma.user.create({
    data: {
      attributes: {
        create: data.attributes,
      },
    },
  });
};

//creates a new post
export const createPost = async (data: any) => {
  return await prisma.post.create({
    data: {
      posterId: data.posterId,
      content: data.content,
      comments: {
        create: data.comments,
      },
    },
  });
};

//creates a new comment
export const createComment = async (data: any) => {
  return await prisma.comment.create({
    data: {
      posterId: data.posterId,
      content: data.content,
    },
  });
};

//creates a new attribute
export const createAttribute = async (data: any) => {
  return await prisma.attribute.create({
    data: {
      type: data.type,
      value: data.value,
    },
  });
};

//creates a new connection
export const createConnection = async (data: any) => {
  return await prisma.connection.create({
    data: {
      userId: data.userId,
      connectedToId: data.connectedToId,
      connectionType: data.connectionType,
    },
  });
};

//creates a new ReadPost
export const createReadPost = async (data: any) => {
  return await prisma.readPost.create({
    data: {
      userId: data.userId,
      postId: data.postId,
    },
  });
};