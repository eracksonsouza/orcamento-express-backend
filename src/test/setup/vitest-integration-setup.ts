import { beforeAll, afterAll, afterEach } from "vitest";
import {
  clearDatabase,
  connectDatabase,
  disconnectDatabase,
} from "./database-helpers";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
});
