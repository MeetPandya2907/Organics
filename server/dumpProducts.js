import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './models/productModel.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Organics');
    const products = await Product.find({}, '-_id -__v -createdAt -updatedAt -user');
    
    // Create the js file string
    let fileStr = `const products = [\n`;
    for (let p of products) {
      if (p.name === 'Sample name') continue; // Don't save sample ones from UI testing
      fileStr += `  {\n`;
      fileStr += `    name: '${p.name.replace(/'/g, "\\'")}',\n`;
      fileStr += `    image: '${p.image}',\n`;
      if (p.images && p.images.length > 0) {
        fileStr += `    images: ${JSON.stringify(p.images)},\n`;
      } else {
        fileStr += `    images: [],\n`;
      }
      fileStr += `    description: '${p.description.replace(/'/g, "\\'")}',\n`;
      fileStr += `    category: '${p.category}',\n`;
      fileStr += `    price: ${p.price},\n`;
      fileStr += `    countInStock: ${p.countInStock},\n`;
      fileStr += `    rating: ${p.rating},\n`;
      fileStr += `    numReviews: ${p.numReviews},\n`;
      fileStr += `  },\n`;
    }
    fileStr += `];\n\nexport default products;\n`;

    fs.writeFileSync('./data/products.js', fileStr);
    console.log('Saved to products.js');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
