-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 2,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "reset_password_token" TEXT,
    "reset_password_sent_at" TIMESTAMP(3),
    "remember_created_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
