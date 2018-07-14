const Product = require('./models/Product');
require('dotenv').config();

// DB connection
const { DB_USERNAME, DB_PASSWORD } = process.env;
const mongoose = require('mongoose');
  mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds137661.mlab.com:37661/hbs-test`, {useNewUrlParser: true}, (err) => {
  err ? console.log(err) : console.log('DB connected!');
});

async function dropCollection() {
  await Product.collection.drop();
}

dropCollection();

let products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Video Game',
    description: 'Awesome Game!!!!',
    price: 10
}),
  new Product({
      imagePath: 'http://eu.blizzard.com/static/_images/games/wow/wallpapers/wall2/wall2-1440x900.jpg',
      title: 'World of Warcraft Video Game',
      description: 'Also awesome? But of course it was better in vanilla ...',
      price: 20
  }),
  new Product({
      imagePath: 'https://support.activision.com/servlet/servlet.FileDownload?file=00PU000000Rq6tz',
      title: 'Call of Duty Video Game',
      description: 'Meh ... nah, it\'s okay I guess',
      price: 40
  }),
  new Product({
      imagePath: 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
      title: 'Minecraft Video Game',
      description: 'Now that is super awesome!',
      price: 15
  }),
  new Product({
      imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
      title: 'Dark Souls 3 Video Game',
      description: 'I died!',
      price: 50
  })
]

products.map((p, index) => {
  p.save((err, result) => {
    if(index === products.length - 1) {
      console.log('DONE!');
      mongoose.disconnect();
    }
  });
});