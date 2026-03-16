/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute(product: { price: { toString: () => any } }) {
          return product.price.toString();
        },
      },
      rating: {
        needs: { rating: true },
        compute(product: { rating: { toString: () => any } }) {
          return product.rating.toString();
        },
      },
    },
  },
});