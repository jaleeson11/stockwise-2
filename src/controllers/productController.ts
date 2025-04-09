import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * Create a new product
 * @route POST /api/products
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, description, categoryId } = req.body;

    // Check if product with SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingProduct) {
      return res.status(400).json({ 
        error: true, 
        message: `Product with SKU ${sku} already exists` 
      });
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        sku,
        name,
        description,
        categoryId
      },
      include: {
        category: true
      }
    });

    return res.status(201).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to create product' 
    });
  }
};

/**
 * Get all products with optional filtering
 * @route GET /api/products
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      categoryId, 
      page = 1, 
      limit = 20 
    } = req.query;

    // Build filter conditions
    const filter: any = {};
    
    if (search) {
      filter.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { sku: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    
    if (categoryId) {
      filter.categoryId = String(categoryId);
    }
    
    // Parse pagination params
    const parsedPage = parseInt(String(page), 10);
    const parsedLimit = parseInt(String(limit), 10);
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Get products with count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        include: {
          category: true,
          variants: {
            include: {
              inventory: true
            }
          }
        },
        skip,
        take: parsedLimit,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.product.count({ where: filter })
    ]);
    
    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch products' 
    });
  }
};

/**
 * Get a product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ 
        error: true, 
        message: 'Product not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch product' 
    });
  }
};

/**
 * Update a product
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sku, name, description, categoryId } = req.body;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ 
        error: true, 
        message: 'Product not found' 
      });
    }
    
    // Check if SKU is changing and already exists
    if (sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku }
      });
      
      if (skuExists) {
        return res.status(400).json({ 
          error: true, 
          message: `Product with SKU ${sku} already exists` 
        });
      }
    }
    
    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        sku,
        name,
        description,
        categoryId
      },
      include: {
        category: true
      }
    });
    
    return res.status(200).json({ 
      success: true, 
      data: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to update product' 
    });
  }
};

/**
 * Delete a product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ 
        error: true, 
        message: 'Product not found' 
      });
    }
    
    // Check if product has variants
    const variantsCount = await prisma.productVariant.count({
      where: { productId: id }
    });
    
    if (variantsCount > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'Cannot delete product with existing variants' 
      });
    }
    
    // Delete product
    await prisma.product.delete({
      where: { id }
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to delete product' 
    });
  }
}; 