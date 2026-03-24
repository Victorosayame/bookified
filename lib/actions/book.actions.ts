"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

//fetch all book
export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: serializeData(books) };

  } catch (error) {
    console.error("Error fetching all books", error);
    return { success: false, error };
  }
}
//check if book already exists before creating anew one
export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    //generate the slug fr the book we want to check for existence
    const slug = generateSlug(title);

    const existingBook = await Book.findOne({slug}).lean();

    if(existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      }
    }

    return {
      exists: false,
    }
  } catch (error) {
    console.error("Error checking if book exists", error);
    return { exists: false, error };
  }
}

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();
    //generate a book slug
    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return { success: false, data: serializeData(existingBook), alreadyExists: true };
    }

    //TODO:check sub limit before creating a book

    const book = await Book.create({...data, slug, totalSegments: 0 });
    return { success: true, data: serializeData(book) };
  } catch (error) {
    console.error("Error creating a book", error);
    return { success: false, error };
  }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
  try {
    await connectToDatabase();

    console.log("Saving book segments...")

    //prepare segments for bulk insert
    const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
      clerkId,
      bookId,
      content: text,
      segmentIndex,
      pageNumber,
      wordCount,
    }));

    await BookSegment.insertMany(segmentsToInsert);
    
    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
    console.log("Book segments saved successfully");

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    }

  } catch (error) {
    console.error("Error saving book segments", error);
    await  BookSegment.deleteMany({ bookId })
    await Book.findByIdAndUpdate(bookId);
    console.log("Deleted book segment and book due to failure to save segments");

    return { success: false, error };
  }
}