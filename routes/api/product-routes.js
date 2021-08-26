const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
   // find all products
    const productData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock'],
      // also include category and tag information in response
      include: [{ model: Category },{model: Tag, through: ProductTag}]
      })

    // if successful status 200 abd show results in JSON format
    res.status(200).json(productData);
  } catch (err) {
    // otherwise error message with Status 500
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    // find specific product by ID
    const productData = await Product.findByPk(req.params.id, {
      attributes: ['id', 'product_name', 'price', 'stock'],
      // also include category and tag information for selected product
      include: [{ model: Category },{model: Tag, through: ProductTag}]
      });

    if (!productData) {
      // if no product found for requested ID
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    } else {
      // otherwise status 200 and results in JSON format
      res.status(200).json(productData);
    }

  } catch (err) {
    res.status(500).json(err);
  }

});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // delete a product for specific ID
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!productData) {
      // if product with specific ID doesn't exist
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    } else {
      // otherwise respond as product deleted
      res.status(200).json('product deleted!');
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
