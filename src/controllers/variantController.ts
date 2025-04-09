import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * Create a new product variant
 * @route POST /api/products/:productId/variants
 */
export const createVariant = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sku, attributes, inventory } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ 
        error: true, 
        message: 'Product not found' 
      });
    }

    // Check if variant with SKU already exists
    const existingVariant = await prisma.productVariant.findUnique({
      where: { sku }
    });

    if (existingVariant) {
      return res.status(400).json({ 
        error: true, 
        message: `Variant with SKU ${sku} already exists` 
      });
    }

    // Create new variant with inventory
    const variant = await prisma.productVariant.create({
      data: {
        sku,
        productId,
        attributes,
        inventory: inventory ? {
          create: {
            quantity: inventory.quantity || 0,
            lowStockThreshold: inventory.lowStockThreshold
          }
        } : undefined
      },
      include: {
        inventory: true,
        product: {
          select: {
            id: true,
            name: true,
            sku: true
          }
        }
      }
    });

    return res.status(201).json({ 
      success: true, 
      data: variant 
    });
  } catch (error) {
    console.error('Error creating variant:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to create variant' 
    });
  }
};

/**
 * Get all variants for a product
 * @route GET /api/products/:productId/variants
 */
export const getProductVariants = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ 
        error: true, 
        message: 'Product not found' 
      });
    }

    // Get variants with inventory
    const variants = await prisma.productVariant.findMany({
      where: { 
        productId 
      },
      include: {
        inventory: true
      },
      orderBy: {
        sku: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: variants
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch variants' 
    });
  }
};

/**
 * Get a variant by ID
 * @route GET /api/variants/:id
 */
export const getVariantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            categoryId: true
          }
        },
        inventory: true,
        inventoryHistory: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!variant) {
      return res.status(404).json({ 
        error: true, 
        message: 'Variant not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: variant 
    });
  } catch (error) {
    console.error('Error fetching variant:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch variant' 
    });
  }
};

/**
 * Update a variant
 * @route PUT /api/variants/:id
 */
export const updateVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sku, attributes } = req.body;
    
    // Check if variant exists
    const existingVariant = await prisma.productVariant.findUnique({
      where: { id }
    });
    
    if (!existingVariant) {
      return res.status(404).json({ 
        error: true, 
        message: 'Variant not found' 
      });
    }
    
    // Check if SKU is changing and already exists
    if (sku !== existingVariant.sku) {
      const skuExists = await prisma.productVariant.findUnique({
        where: { sku }
      });
      
      if (skuExists) {
        return res.status(400).json({ 
          error: true, 
          message: `Variant with SKU ${sku} already exists` 
        });
      }
    }
    
    // Update variant
    const updatedVariant = await prisma.productVariant.update({
      where: { id },
      data: {
        sku,
        attributes
      },
      include: {
        inventory: true,
        product: {
          select: {
            id: true,
            name: true,
            sku: true
          }
        }
      }
    });
    
    return res.status(200).json({ 
      success: true, 
      data: updatedVariant 
    });
  } catch (error) {
    console.error('Error updating variant:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to update variant' 
    });
  }
};

/**
 * Delete a variant
 * @route DELETE /api/variants/:id
 */
export const deleteVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if variant exists
    const existingVariant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        inventory: true,
        orderItems: {
          select: { id: true }
        }
      }
    });
    
    if (!existingVariant) {
      return res.status(404).json({ 
        error: true, 
        message: 'Variant not found' 
      });
    }
    
    // Check if variant has associated order items
    if (existingVariant.orderItems.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'Cannot delete variant with associated orders' 
      });
    }
    
    // Delete inventory if exists
    if (existingVariant.inventory) {
      await prisma.inventory.delete({
        where: { 
          variantId: id 
        }
      });
    }
    
    // Delete inventory history
    await prisma.inventoryHistory.deleteMany({
      where: { 
        variantId: id 
      }
    });
    
    // Delete platform inventory
    await prisma.platformInventory.deleteMany({
      where: { 
        variantId: id 
      }
    });
    
    // Delete variant
    await prisma.productVariant.delete({
      where: { id }
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Variant deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to delete variant' 
    });
  }
};

/**
 * Update variant inventory
 * @route PUT /api/variants/:id/inventory
 */
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, lowStockThreshold, reason } = req.body;
    const userId = req.body.userId || '1'; // In a real app, get from auth middleware
    
    // Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        inventory: true
      }
    });
    
    if (!variant) {
      return res.status(404).json({ 
        error: true, 
        message: 'Variant not found' 
      });
    }
    
    // Calculate quantity change for history
    const currentQuantity = variant.inventory?.quantity || 0;
    const quantityChange = quantity - currentQuantity;
    
    // Create or update inventory
    let updatedInventory;
    if (variant.inventory) {
      updatedInventory = await prisma.inventory.update({
        where: { 
          variantId: id 
        },
        data: {
          quantity,
          lowStockThreshold
        }
      });
    } else {
      updatedInventory = await prisma.inventory.create({
        data: {
          variantId: id,
          quantity,
          lowStockThreshold
        }
      });
    }
    
    // Create inventory history record
    if (quantityChange !== 0) {
      await prisma.inventoryHistory.create({
        data: {
          variantId: id,
          userId,
          quantityChange,
          quantityAfter: quantity,
          reason: reason || `Manual adjustment (${quantityChange > 0 ? 'increase' : 'decrease'})`
        }
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: updatedInventory,
      quantityChange
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to update inventory' 
    });
  }
};

/**
 * Get inventory history for a variant
 * @route GET /api/variants/:id/inventory/history
 */
export const getInventoryHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    // Parse pagination parameters
    const parsedLimit = parseInt(String(limit), 10);
    const parsedPage = parseInt(String(page), 10);
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id }
    });
    
    if (!variant) {
      return res.status(404).json({ 
        error: true, 
        message: 'Variant not found' 
      });
    }
    
    // Get inventory history with count
    const [history, total] = await Promise.all([
      prisma.inventoryHistory.findMany({
        where: { 
          variantId: id 
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parsedLimit
      }),
      prisma.inventoryHistory.count({
        where: { 
          variantId: id 
        }
      })
    ]);
    
    return res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch inventory history' 
    });
  }
}; 