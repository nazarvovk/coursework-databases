-- CreateTable
CREATE TABLE "Customer" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '---'
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "createdTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryTime" DATETIME,
    "customerPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "Order_customerPhone_fkey" FOREIGN KEY ("customerPhone") REFERENCES "Customer" ("phone") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "OrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "description" TEXT
);
