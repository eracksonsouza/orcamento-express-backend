import { prismaTest } from "./prisma-test-client";

/**
 * Clears all data from the test database
 * Order matters due to foreign key constraints
 */
export async function clearDatabase(): Promise<void> {
  await prismaTest.$transaction([
    prismaTest.quoteFile.deleteMany(),
    prismaTest.quoteItem.deleteMany(),
    prismaTest.quote.deleteMany(),
    prismaTest.vehicle.deleteMany(),
    prismaTest.customer.deleteMany(),
  ]);
}

/**
 * Connects to the test database
 */
export async function connectDatabase(): Promise<void> {
  await prismaTest.$connect();
}

/**
 * Disconnects from the test database
 */
export async function disconnectDatabase(): Promise<void> {
  await prismaTest.$disconnect();
}
