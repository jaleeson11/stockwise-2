import { Request, Response } from 'express';
import { prisma } from '../server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new category
 * @route POST /api/categories
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    console.log('Received request data:', { name, parentId });

    // Check if category with same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name,
        parentId: parentId || null
      }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        error: true, 
        message: 'Category with this name already exists at this level' 
      });
    }

    // Check if parent exists if parentId is provided
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentExists) {
        return res.status(404).json({ 
          error: true, 
          message: 'Parent category not found' 
        });
      }
    }

    // Generate UUID for the new category
    const categoryId = uuidv4();
    console.log('Generated category ID:', categoryId);

    // Create new category with generated UUID
    const category = await prisma.category.create({
      data: {
        id: categoryId,
        name,
        parentId: parentId || null
      }
    });

    console.log('Created category:', category);

    return res.status(201).json({ 
      success: true, 
      data: category 
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to create category',
      details: error?.message 
    });
  }
};

/**
 * Get all categories with optional hierarchy
 * @route GET /api/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { flat = 'true' } = req.query;
    const shouldBuildTree = flat !== 'true';
    
    // Get all categories
    const categories = await prisma.category.findMany({
      include: shouldBuildTree ? {
        children: true
      } : undefined,
      where: shouldBuildTree ? {
        parentId: null
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch categories' 
    });
  }
};

/**
 * Get a category by ID with its children
 * @route GET /api/categories/:id
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          take: 10,
          select: {
            id: true,
            name: true,
            sku: true
          }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({ 
        error: true, 
        message: 'Category not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to fetch category' 
    });
  }
};

/**
 * Update a category
 * @route PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ 
        error: true, 
        message: 'Category not found' 
      });
    }
    
    // Prevent circular references - a category cannot be its own ancestor
    if (parentId) {
      // Check if parent exists
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentExists) {
        return res.status(404).json({ 
          error: true, 
          message: 'Parent category not found' 
        });
      }

      // Check if trying to set parent to self
      if (parentId === id) {
        return res.status(400).json({ 
          error: true, 
          message: 'A category cannot be its own parent' 
        });
      }
      
      // Check if trying to set parent to one of its descendants
      let currentId = parentId;
      while (currentId) {
        if (currentId === id) {
          return res.status(400).json({ 
            error: true, 
            message: 'A category cannot have a descendant as its parent (circular reference)' 
          });
        }
        
        const parent = await prisma.category.findUnique({
          where: { id: currentId },
          select: { parentId: true }
        });
        
        currentId = parent?.parentId || null;
      }
    }
    
    // Check for duplicate name at same level
    if (name !== existingCategory.name) {
      const duplicateName = await prisma.category.findFirst({
        where: { 
          name,
          parentId: parentId || null,
          id: { not: id }
        }
      });
      
      if (duplicateName) {
        return res.status(400).json({ 
          error: true, 
          message: 'Category with this name already exists at this level' 
        });
      }
    }
    
    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        parentId: parentId || null
      },
      include: {
        parent: true,
        children: true
      }
    });
    
    return res.status(200).json({ 
      success: true, 
      data: updatedCategory 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to update category' 
    });
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: {
          select: { id: true }
        }
      }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ 
        error: true, 
        message: 'Category not found' 
      });
    }
    
    // Check if category has children
    if (existingCategory.children.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'Cannot delete category with subcategories' 
      });
    }
    
    // Check if category has products
    if (existingCategory.products.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'Cannot delete category with associated products' 
      });
    }
    
    // Delete category
    await prisma.category.delete({
      where: { id }
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ 
      error: true, 
      message: 'Failed to delete category' 
    });
  }
}; 