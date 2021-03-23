const { Router } = require('express')
const productServices = require('../services/productServices')
const accessoryServices = require('../services/accessoryServices')
const router = Router()
const { validateProduct } = require('./helpers/productHelper')


router.get('/', (req, res) => {
    productServices.getAll(req.query)
        .then((products) => {
            res.render('home', { title: 'Products', products })
        }).catch(() => res.status(500).end())
})
router.get('/create', (req, res) => {
    res.render('create', { title: 'Create' })
})
router.post('/create', validateProduct, (req, res) => {

    //TODO: VALIDATE INPUTS!    
    productServices.create(req.body)
        .then(() => res.redirect('/'))
        .catch(() => res.status(500).end())

})

router.get('/details/:productId', async(req, res) => {
    let products = await productServices.getByIdWithAccessories(req.params.productId)
    
    res.render('details', { title: 'Product Details', products })
})

router.get('/:productId/attach', async(req, res)=>{
    let products = await productServices.getById(req.params.productId)
    let accessories = await accessoryServices.getAllWithout(products.accessories)

    res.render('attachAccessory',{title: 'Attach Accsessory', products , accessories})
})  
router.post('/:productId/attach',(req, res)=>{
    productServices.attachAccessory(req.params.productId,req.body.accessory)
    .then(()=> res.redirect(`/details/${req.params.productId}`))
})
module.exports = router