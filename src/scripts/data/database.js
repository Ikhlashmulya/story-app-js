import { openDB } from "idb";
import { addStory } from "./api";

const OBJECT_STORE_NAME = "stories";

const dbPromise = openDB("storyapp", 1, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });
  },
});

const Database = {
  addStory: async (story) => {
    return (await dbPromise).add(OBJECT_STORE_NAME, story);
  },
  getStories: async () => {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  deleteStory: async (id) => {
    return (await dbPromise).delete(OBJECT_STORE_NAME, parseInt(id));
  },
  updateStory: async (story) => {
    if (!Object.hasOwn(story, "id")) {
      throw new Error("Story must have an id");
    }

    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  getStoryById: async (id) => {
    return (await dbPromise).get(OBJECT_STORE_NAME, parseInt(id));
  },
};

export default Database;
