import mongoose from "mongoose";
import dotenv from "dotenv";
import restaurantModel from "../models/restaurantModel.js"; // adjust path if needed

dotenv.config();

const restaurants = [
  {
    name: "Punjabi Rasoi",
    city: "Delhi",
    address: "Connaught Place, Delhi",
    cuisine: "North Indian",
    rating: 4.5,
    image: "https://source.unsplash.com/800x600/?restaurant,india"
  },
  {
    name: "Biryani Ghar",
    city: "Lucknow",
    address: "Hazratganj, Lucknow",
    cuisine: "Awadhi",
    rating: 4.4,
    image: "https://source.unsplash.com/800x600/?biryani,restaurant"
  },
  {
    name: "Rajputana Haveli",
    city: "Jaipur",
    address: "MI Road, Jaipur",
    cuisine: "Rajasthani",
    rating: 4.6,
    image: "https://source.unsplash.com/800x600/?rajasthan,restaurant"
  },
  {
    name: "Amritsar Dhaba",
    city: "Amritsar",
    address: "Golden Temple Road, Amritsar",
    cuisine: "Punjabi",
    rating: 4.7,
    image: "https://source.unsplash.com/800x600/?dhaba,punjab"
  },
  {
    name: "Kashmiri Wazwan House",
    city: "Srinagar",
    address: "Dal Lake Boulevard, Srinagar",
    cuisine: "Kashmiri",
    rating: 4.5,
    image: "https://source.unsplash.com/800x600/?kashmir,food"
  },
  {
    name: "Indori Poha Junction",
    city: "Indore",
    address: "Sarafa Bazaar, Indore",
    cuisine: "Street Food",
    rating: 4.3,
    image: "https://source.unsplash.com/800x600/?indore,food"
  },
  {
    name: "Ghar ka Swad",
    city: "Kanpur",
    address: "Civil Lines, Kanpur",
    cuisine: "North Indian",
    rating: 4.2,
    image: "https://source.unsplash.com/800x600/?indian,restaurant"
  },
  {
    name: "Haryana Haveli",
    city: "Gurgaon",
    address: "Sector 29, Gurgaon",
    cuisine: "Traditional Indian",
    rating: 4.4,
    image: "https://source.unsplash.com/800x600/?haryana,food"
  },
  {
    name: "Hyderabadi Biryani House",
    city: "Hyderabad",
    address: "Banjara Hills, Hyderabad",
    cuisine: "Hyderabadi",
    rating: 4.6,
    image: "https://source.unsplash.com/800x600/?biryani,india"
  },
  {
    name: "Mumbai Tawa Treats",
    city: "Mumbai",
    address: "Marine Drive, Mumbai",
    cuisine: "Street Food",
    rating: 4.3,
    image: "https://source.unsplash.com/800x600/?mumbai,restaurant"
  },
  {
    name: "Bengal Delight",
    city: "Kolkata",
    address: "Park Street, Kolkata",
    cuisine: "Bengali",
    rating: 4.5,
    image: "https://source.unsplash.com/800x600/?bengal,food"
  },
  {
    name: "Chennai Andhra Spice",
    city: "Chennai",
    address: "T Nagar, Chennai",
    cuisine: "South Indian",
    rating: 4.4,
    image: "https://source.unsplash.com/800x600/?south,indian,restaurant"
  },
  {
    name: "Café Chandigarh",
    city: "Chandigarh",
    address: "Sector 17, Chandigarh",
    cuisine: "Modern Indian",
    rating: 4.5,
    image: "https://source.unsplash.com/800x600/?cafe,india"
  }
];
export default restaurants;


async function seedRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    await restaurantModel.deleteMany(); // optional: clean old
    await restaurantModel.insertMany(restaurants);

    console.log("✅ Restaurant Data Seeded Successfully");
    process.exit();
  } catch (err) {
    console.log("❌ Seeding Failed", err);
    process.exit(1);
  }
}

seedRestaurants();
