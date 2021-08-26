const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    // find all tags
    const tagData = await Tag.findAll({
      include: [{ 
       model: Product,
       // also include product information for all categories
       attributes: ['id', 'product_name', 'price', 'stock']
      }],
    });
    // if successful status 200 and show results in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    // otherwise error message with Status 500
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // find specific tag by ID
    const tagData = await Tag.findByPk(req.params.id, {
      include: { 
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      },
    });

    if (!tagData) {
      // if no tag found for requested ID
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    } else {
      // otherwise status 200 and results in JSON format
      res.status(200).json(tagData);
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    // if successful status 200 and show results in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // update tag for specific ID
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    // if successful status 200 and results in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    // delete a tag for specific ID
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!tagData) {
      // if Tag with specific ID doesn't exist
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    } else {
      // otherwise respond as tag deleted
      res.status(200).json('tag deleted!');
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
