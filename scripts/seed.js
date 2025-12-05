import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import Package from '../src/models/Package.js';
import Lead from '../src/models/Lead.js';

const events = [
  {
    name: 'ICC Cricket World Cup 2025',
    description: 'Experience the biggest cricket tournament in the world with matches across iconic Indian stadiums',
    location: 'Mumbai, Delhi, Bangalore, India',
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-11-15'),
    category: 'Cricket',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e'
  },
  {
    name: 'FIFA World Cup 2026',
    description: 'Be part of the greatest show on earth as nations compete for football glory',
    location: 'USA, Canada, Mexico',
    startDate: new Date('2026-06-11'),
    endDate: new Date('2026-07-19'),
    category: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55'
  },
  {
    name: 'Wimbledon Championships 2025',
    description: 'Witness tennis excellence at the most prestigious tournament on grass',
    location: 'London, United Kingdom',
    startDate: new Date('2025-06-23'),
    endDate: new Date('2025-07-06'),
    category: 'Tennis',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8'
  }
];

const packages = [
  // Cricket World Cup Packages
  {
    name: 'Bronze Cricket Package',
    description: 'Essential cricket experience with match tickets and comfortable accommodation',
    basePrice: 1500,
    inclusions: [
      'Category B match tickets',
      '3-star hotel accommodation',
      'Daily breakfast',
      'Airport pickup',
      'Match day transport'
    ],
    duration: 5,
    accommodationType: '3-star hotel',
    maxTravelers: 10
  },
  {
    name: 'Silver Cricket Package',
    description: 'Premium cricket experience with better seats and enhanced amenities',
    basePrice: 3000,
    inclusions: [
      'Category A premium match tickets',
      '4-star hotel accommodation',
      'All meals included',
      'Airport transfers',
      'City tour',
      'Official merchandise'
    ],
    duration: 7,
    accommodationType: '4-star hotel',
    maxTravelers: 8
  },
  // FIFA World Cup Packages
  {
    name: 'Gold Football Package',
    description: 'Luxury football experience with VIP access and premium hospitality',
    basePrice: 5000,
    inclusions: [
      'VIP match tickets',
      '5-star hotel accommodation',
      'All meals and beverages',
      'Private airport transfers',
      'Stadium tours',
      'Meet and greet opportunities',
      'Official FIFA merchandise'
    ],
    duration: 7,
    accommodationType: '5-star hotel',
    maxTravelers: 6
  },
  {
    name: 'Platinum Football Package',
    description: 'Ultimate football experience with exclusive access and luxury amenities',
    basePrice: 8000,
    inclusions: [
      'Premium VIP tickets with hospitality',
      'Luxury 5-star hotel suite',
      'Gourmet dining experiences',
      'Private chauffeur service',
      'Exclusive pre-match events',
      'Player meet and greet',
      'Personalized concierge service',
      'Premium gift package'
    ],
    duration: 10,
    accommodationType: 'Luxury hotel suite',
    maxTravelers: 4
  },
  // Wimbledon Packages
  {
    name: 'Centre Court Experience',
    description: 'Watch tennis from the legendary Centre Court with premium hospitality',
    basePrice: 4000,
    inclusions: [
      'Centre Court tickets',
      '4-star boutique hotel',
      'Daily breakfast and dinner',
      'London city tour',
      'Thames river cruise',
      'Wimbledon museum access'
    ],
    duration: 5,
    accommodationType: '4-star boutique hotel',
    maxTravelers: 8
  },
  {
    name: 'Royal Wimbledon Package',
    description: 'Experience Wimbledon like royalty with exclusive access and luxury',
    basePrice: 7000,
    inclusions: [
      'Debenture Centre Court tickets',
      '5-star luxury hotel',
      'All gourmet meals',
      'Champagne reception',
      'Private tennis lesson',
      'Royal Box area access',
      'Personal guide',
      'Luxury gift hamper'
    ],
    duration: 7,
    accommodationType: '5-star luxury hotel',
    maxTravelers: 4
  }
];

// Sample leads for testing
const sampleLeads = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0123',
    numberOfTravelers: 2,
    status: 'New',
    notes: 'Interested in cricket packages'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1-555-0124',
    numberOfTravelers: 4,
    status: 'Contacted',
    notes: 'Family trip to FIFA World Cup'
  },
  {
    name: 'Emma Williams',
    email: 'emma.williams@example.com',
    phone: '+44-7700-900123',
    numberOfTravelers: 2,
    status: 'New',
    notes: 'Tennis enthusiast, wants Wimbledon tickets'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seed...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await Event.deleteMany({});
    await Package.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data\n');

    // Insert events
    console.log('Creating events...');
    const createdEvents = await Event.insertMany(events);
    console.log(`Created ${createdEvents.length} events:`);
    createdEvents.forEach(event => {
      console.log(`   - ${event.name} (${event.location})`);
    });
    console.log('');

    // Link packages to events and insert
    console.log('Creating packages...');
    packages[0].eventId = createdEvents[0]._id; // Cricket Bronze
    packages[1].eventId = createdEvents[0]._id; // Cricket Silver
    packages[2].eventId = createdEvents[1]._id; // FIFA Gold
    packages[3].eventId = createdEvents[1]._id; // FIFA Platinum
    packages[4].eventId = createdEvents[2]._id; // Wimbledon Centre
    packages[5].eventId = createdEvents[2]._id; // Wimbledon Royal

    const createdPackages = await Package.insertMany(packages);
    console.log(`Created ${createdPackages.length} packages:`);
    createdPackages.forEach(pkg => {
      console.log(`   - ${pkg.name} ($${pkg.basePrice})`);
    });
    console.log('');

    // Create sample leads
    console.log('Creating sample leads...');
    sampleLeads[0].eventId = createdEvents[0]._id;
    sampleLeads[0].travelDate = new Date('2025-10-20');
    sampleLeads[1].eventId = createdEvents[1]._id;
    sampleLeads[1].travelDate = new Date('2026-06-15');
    sampleLeads[2].eventId = createdEvents[2]._id;
    sampleLeads[2].travelDate = new Date('2025-06-25');

    const createdLeads = await Lead.insertMany(sampleLeads);
    console.log(`Created ${createdLeads.length} sample leads\n`);

    // Summary
    console.log('Database seeded successfully!');
    console.log(`Summary:`);
    console.log(`   Events: ${createdEvents.length}`);
    console.log(`   Packages: ${createdPackages.length}`);
    console.log(`   Sample Leads: ${createdLeads.length}`);

    console.log('You can now start the server with: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

// Run seed function
seedDatabase();