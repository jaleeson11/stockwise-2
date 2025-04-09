import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockwise.com' },
    update: {},
    create: {
      email: 'admin@stockwise.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@stockwise.com' },
    update: {},
    create: {
      email: 'manager@stockwise.com',
      passwordHash: managerPassword,
      name: 'Manager User',
      role: 'MANAGER',
    },
  });
  console.log(`Created manager user: ${manager.email}`);

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@stockwise.com' },
    update: {},
    create: {
      email: 'staff@stockwise.com',
      passwordHash: staffPassword,
      name: 'Staff User',
      role: 'STAFF',
    },
  });
  console.log(`Created staff user: ${staff.email}`);

  // Create categories
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Home & Kitchen' },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { id: category.name },
      update: {},
      create: {
        id: category.name,
        name: category.name,
      },
    });
    console.log(`Created category: ${createdCategory.name}`);
  }

  // Create some sample products
  const sampleProducts = [
    {
      sku: 'ELEC-001',
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      categoryId: 'Electronics',
    },
    {
      sku: 'ELEC-002',
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      categoryId: 'Electronics',
    },
    {
      sku: 'CLOTH-001',
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt',
      categoryId: 'Clothing',
    },
    {
      sku: 'HOME-001',
      name: 'Coffee Maker',
      description: 'Automatic coffee maker with timer',
      categoryId: 'Home & Kitchen',
    },
  ];

  for (const product of sampleProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
      },
    });
    
    // Create a variant for each product
    const variantSku = `${product.sku}-V1`;
    const variant = await prisma.productVariant.upsert({
      where: { sku: variantSku },
      update: {},
      create: {
        sku: variantSku,
        productId: createdProduct.id,
        attributes: { color: 'Black', size: 'Standard' },
      },
    });
    
    // Create inventory for the variant
    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: { quantity: 100 },
      create: {
        variantId: variant.id,
        quantity: 100,
        lowStockThreshold: 10,
      },
    });
    
    console.log(`Created product: ${createdProduct.name} with variant and inventory`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 