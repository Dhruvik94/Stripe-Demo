require('dotenv').config()
const express = require("express")
const bodyparser = require('body-parser')
const path = require('path')
const app = express()


var Publishable_Key = process.env.Publishable_Key
var Secret_Key = process.env.Secret_Key

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('Home', {
        key: Publishable_Key
    })
})

app.post('/payment', function (req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Dhruvik Barvaliya',
        address: {
            line1: 'Yogi Chowk',
            postal_code: '395006',
            city: 'Surat',
            state: 'Gujarat',
            country: 'India',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 7000,    // Charing Rs 25 
                description: 'Coffee',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs 
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        });
})

app.listen(port, function (error) {
    if (error) throw error
    console.log(`Server created Successfully on Port ${port}`)
})