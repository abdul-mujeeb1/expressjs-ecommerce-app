const product = require('../models/product');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: ''
  });
};

exports.postAddProduct = (req, res, next) => {
  const image = req.file;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
    });
  }

  const imageUrl = image.path;

  Product.create({
    title,
    imageUrl,
    price,
    description
  }).then(response => {
    req.flash('info', 'Product has been added successfully!');
    res.redirect('/');
  }).catch(err => {
    console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    if (!product) {
      res.redirect('/admin/products');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      errorMessage: ''
    });
  }).catch(err => {
    res.redirect('/admin/products');
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId).then(product => {
    product.title = updatedTitle;
    product.description = updatedDesc;
    if (image) {
      product.imageUrl = image.path;
    }
    product.price = updatedPrice
    return product.save()
  })
    // go for nested promise return by product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {

    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  }).catch(error => {
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
