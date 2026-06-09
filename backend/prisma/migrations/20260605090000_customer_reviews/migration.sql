-- CreateTable
CREATE TABLE "customer_reviews" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "review" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_reviews_pkey" PRIMARY KEY ("id")
);
