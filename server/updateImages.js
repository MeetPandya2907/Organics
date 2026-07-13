import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from './models/productModel.js';

dotenv.config();

const getImagesFromUrl = async (url) => {
  try {
    console.log(`Fetching ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const images = [];
    $('.woocommerce-product-gallery__image a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) images.push(href);
    });

    if (images.length === 0) {
        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) images.push(ogImage);
    }
    
    return images;
  } catch (error) {
    console.error(`Failed to fetch ${url}: ${error.message}`);
    return [];
  }
};

const mapProductNameToSlug = (name) => {
  let slug = name.split(' (')[0].toLowerCase().replace(/\s+/g, '-');
  return slug;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Organics');
    console.log('MongoDB Connected');
    
    const products = await Product.find({});
    
    for (const product of products) {
      let slug = mapProductNameToSlug(product.name);
      
      // Special mappings for the failed ones
      if (slug === 'white-quinoa') slug = 'quinoa-seeds';
      if (slug === 'dehydrated-onion-flakes') slug = 'dehydrated-onion';
      if (slug === 'dehydrated-garlic-powder') slug = 'dehydrated-garlic';
      
      let url = `https://fittreeinternational.com/product/${slug}/`;
      
      const images = await getImagesFromUrl(url);
      
      if (images.length > 0) {
        console.log(`Found ${images.length} images for ${product.name}`);
        product.image = images[0];
        product.images = images.slice(1);
        await product.save();
        console.log(`Updated ${product.name}`);
      } else {
        console.log(`No images found for ${product.name}`);
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
