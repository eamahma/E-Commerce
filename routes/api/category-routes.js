const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    // find all categories
    const categoryData = await Category.findAll({
      // also include product information for all categories
      include: [{ 
       model: Product,
       attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }],
    });
    // if successful status 200 and show results in JSON format
    res.status(200).json(categoryData);
  } catch (err) {
    // otherwise error message with Status 500
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    // find specific category by ID
    const categoryData = await Category.findByPk(req.params.id, {
      // also include product information for selected category
      include: { 
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      },
    });

    if (!categoryData) {
      // if no category found for requested ID
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    } else {
      // otherwise status 200 and results in JSON format
      res.status(200).json(categoryData);
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    // Create a new Category
    const categoryData = await Category.create(req.body);
    // if successful status 200 and show results in JSON format
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    // update category for specific ID
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    // if successful status 200 and results in JSON format
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // delete a category for specific ID
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!categoryData) {
      // if Category with specific ID doesn't exist
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    } else {
      // otherwise respond as category deleted
      res.status(200).json('category deleted!');
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
