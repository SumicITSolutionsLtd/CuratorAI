import { WardrobeItem, Wardrobe, WardrobeStats } from '@/domain/entities/Wardrobe'

// Helper to generate random past dates
const getRandomPastDate = (daysAgo: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

// Mock Wardrobe Items
export const mockWardrobeItems: WardrobeItem[] = [
  // TOPS
  {
    id: 'item-1',
    wardrobeId: 'wardrobe-1',
    category: 'top',
    name: 'Silk Blouse',
    brand: 'Zara',
    color: 'Ivory',
    size: 'M',
    price: 89.99,
    currency: 'USD',
    purchaseDate: new Date('2024-03-15'),
    material: 'Silk',
    images: [
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80',
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Summer' },
      { key: 'occasion', value: 'Casual, Office' },
      { key: 'care', value: 'Dry Clean Only' },
    ],
    tags: ['Elegant', 'Versatile', 'Work-appropriate'],
    notes: 'Perfect for summer office days. Pairs well with navy pants.',
    timesWorn: 12,
    purchaseLink: 'https://www.zara.com/example',
    createdAt: new Date('2024-03-15'),
    updatedAt: getRandomPastDate(5),
  },
  {
    id: 'item-2',
    wardrobeId: 'wardrobe-1',
    category: 'top',
    name: 'Cashmere Sweater',
    brand: 'Uniqlo',
    color: 'Beige',
    size: 'S',
    price: 129.99,
    currency: 'USD',
    purchaseDate: new Date('2024-01-20'),
    material: 'Cashmere',
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Fall/Winter' },
      { key: 'occasion', value: 'Casual, Smart Casual' },
      { key: 'care', value: 'Hand Wash Cold' },
    ],
    tags: ['Cozy', 'Luxury', 'Timeless'],
    notes: 'Investment piece. Very soft and warm.',
    timesWorn: 18,
    purchaseLink: 'https://www.uniqlo.com/example',
    createdAt: new Date('2024-01-20'),
    updatedAt: getRandomPastDate(3),
  },
  {
    id: 'item-3',
    wardrobeId: 'wardrobe-1',
    category: 'top',
    name: 'Leather Jacket',
    brand: 'AllSaints',
    color: 'Black',
    size: 'M',
    price: 449.99,
    currency: 'USD',
    purchaseDate: new Date('2023-10-10'),
    material: 'Genuine Leather',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Fall/Winter' },
      { key: 'occasion', value: 'Casual, Night Out' },
      { key: 'care', value: 'Professional Leather Care' },
    ],
    tags: ['Edgy', 'Statement', 'Classic'],
    notes: 'Favorite jacket! Gets compliments every time.',
    timesWorn: 25,
    purchaseLink: 'https://www.allsaints.com/example',
    createdAt: new Date('2023-10-10'),
    updatedAt: getRandomPastDate(5),
  },
  {
    id: 'item-4',
    wardrobeId: 'wardrobe-1',
    category: 'top',
    name: 'Striped T-Shirt',
    brand: 'COS',
    color: 'Navy/White',
    size: 'M',
    price: 45.0,
    currency: 'USD',
    purchaseDate: new Date('2024-04-05'),
    material: 'Cotton',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual' },
      { key: 'care', value: 'Machine Wash' },
    ],
    tags: ['Basic', 'Versatile', 'Nautical'],
    notes: 'Great basic piece. Wear it all the time.',
    timesWorn: 32,
    createdAt: new Date('2024-04-05'),
    updatedAt: getRandomPastDate(2),
  },

  // BOTTOMS
  {
    id: 'item-5',
    wardrobeId: 'wardrobe-1',
    category: 'bottom',
    name: 'High-Waisted Jeans',
    brand: "Levi's",
    color: 'Dark Blue',
    size: '28',
    price: 98.0,
    currency: 'USD',
    purchaseDate: new Date('2024-02-14'),
    material: 'Denim',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual, Smart Casual' },
      { key: 'care', value: 'Machine Wash Cold' },
      { key: 'fit', value: 'High-Rise, Slim' },
    ],
    tags: ['Classic', 'Flattering', 'Everyday'],
    notes: 'Most comfortable jeans. Perfect fit!',
    timesWorn: 45,
    purchaseLink: 'https://www.levis.com/example',
    createdAt: new Date('2024-02-14'),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: 'item-6',
    wardrobeId: 'wardrobe-1',
    category: 'bottom',
    name: 'Pleated Midi Skirt',
    brand: 'COS',
    color: 'Navy',
    size: 'S',
    price: 79.0,
    currency: 'USD',
    purchaseDate: new Date('2024-03-22'),
    material: 'Polyester',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Fall' },
      { key: 'occasion', value: 'Office, Date Night' },
      { key: 'care', value: 'Dry Clean' },
    ],
    tags: ['Feminine', 'Elegant', 'Versatile'],
    notes: 'Love the flowy movement. Great for twirling!',
    timesWorn: 10,
    createdAt: new Date('2024-03-22'),
    updatedAt: getRandomPastDate(4),
  },
  {
    id: 'item-7',
    wardrobeId: 'wardrobe-1',
    category: 'bottom',
    name: 'Wide-Leg Trousers',
    brand: 'Mango',
    color: 'Cream',
    size: 'M',
    price: 69.99,
    currency: 'USD',
    purchaseDate: new Date('2024-05-10'),
    material: 'Linen Blend',
    images: [
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Summer' },
      { key: 'occasion', value: 'Casual, Office' },
      { key: 'care', value: 'Machine Wash' },
    ],
    tags: ['Breezy', 'Comfortable', 'Chic'],
    notes: 'Perfect summer work pants. Breathable and stylish.',
    timesWorn: 8,
    createdAt: new Date('2024-05-10'),
    updatedAt: getRandomPastDate(6),
  },
  {
    id: 'item-8',
    wardrobeId: 'wardrobe-1',
    category: 'bottom',
    name: 'Black Skinny Jeans',
    brand: 'Zara',
    color: 'Black',
    size: '27',
    price: 49.99,
    currency: 'USD',
    purchaseDate: new Date('2023-11-01'),
    material: 'Stretch Denim',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual, Night Out' },
      { key: 'care', value: 'Machine Wash' },
    ],
    tags: ['Essential', 'Sleek', 'Versatile'],
    notes: 'Go-to for casual nights out.',
    timesWorn: 38,
    createdAt: new Date('2023-11-01'),
    updatedAt: getRandomPastDate(2),
  },

  // DRESSES
  {
    id: 'item-9',
    wardrobeId: 'wardrobe-1',
    category: 'dress',
    name: 'Floral Midi Dress',
    brand: 'H&M',
    color: 'Multicolor',
    size: 'M',
    price: 59.99,
    currency: 'USD',
    purchaseDate: new Date('2024-04-18'),
    material: 'Cotton Blend',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Summer' },
      { key: 'occasion', value: 'Casual, Garden Party' },
      { key: 'care', value: 'Machine Wash' },
    ],
    tags: ['Romantic', 'Feminine', 'Colorful'],
    notes: 'Perfect for spring events. Always get compliments!',
    timesWorn: 8,
    createdAt: new Date('2024-04-18'),
    updatedAt: getRandomPastDate(7),
  },
  {
    id: 'item-10',
    wardrobeId: 'wardrobe-1',
    category: 'dress',
    name: 'Little Black Dress',
    brand: 'Reformation',
    color: 'Black',
    size: 'S',
    price: 178.0,
    currency: 'USD',
    purchaseDate: new Date('2023-12-05'),
    material: 'Viscose',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Cocktail, Date Night, Formal' },
      { key: 'care', value: 'Hand Wash' },
    ],
    tags: ['Classic', 'Elegant', 'Timeless'],
    notes: 'Essential LBD. Never fails me for special occasions.',
    timesWorn: 15,
    purchaseLink: 'https://www.thereformation.com/example',
    createdAt: new Date('2023-12-05'),
    updatedAt: getRandomPastDate(10),
  },
  {
    id: 'item-11',
    wardrobeId: 'wardrobe-1',
    category: 'dress',
    name: 'Wrap Dress',
    brand: 'Diane von Furstenberg',
    color: 'Green',
    size: 'M',
    price: 428.0,
    currency: 'USD',
    purchaseDate: new Date('2024-01-15'),
    material: 'Silk Jersey',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Summer' },
      { key: 'occasion', value: 'Office, Events' },
      { key: 'care', value: 'Dry Clean' },
    ],
    tags: ['Iconic', 'Flattering', 'Investment'],
    notes: 'Splurge purchase but worth it. So flattering!',
    timesWorn: 6,
    createdAt: new Date('2024-01-15'),
    updatedAt: getRandomPastDate(15),
  },

  // SHOES
  {
    id: 'item-12',
    wardrobeId: 'wardrobe-1',
    category: 'shoes',
    name: 'White Sneakers',
    brand: 'Nike',
    color: 'White',
    size: '8',
    price: 110.0,
    currency: 'USD',
    purchaseDate: new Date('2024-03-01'),
    material: 'Leather',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual, Athleisure' },
      { key: 'care', value: 'Wipe Clean' },
    ],
    tags: ['Comfortable', 'Versatile', 'Classic'],
    notes: 'Daily drivers. So comfortable!',
    timesWorn: 52,
    createdAt: new Date('2024-03-01'),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: 'item-13',
    wardrobeId: 'wardrobe-1',
    category: 'shoes',
    name: 'Black Ankle Boots',
    brand: 'Sam Edelman',
    color: 'Black',
    size: '8.5',
    price: 150.0,
    currency: 'USD',
    purchaseDate: new Date('2023-10-20'),
    material: 'Leather',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Fall/Winter' },
      { key: 'occasion', value: 'Casual, Office' },
      { key: 'care', value: 'Leather Conditioner' },
      { key: 'heel height', value: '2 inches' },
    ],
    tags: ['Versatile', 'Chic', 'Comfortable'],
    notes: 'Perfect heel height. Can wear all day.',
    timesWorn: 28,
    createdAt: new Date('2023-10-20'),
    updatedAt: getRandomPastDate(3),
  },
  {
    id: 'item-14',
    wardrobeId: 'wardrobe-1',
    category: 'shoes',
    name: 'Nude Heels',
    brand: 'Steve Madden',
    color: 'Nude',
    size: '8',
    price: 89.99,
    currency: 'USD',
    purchaseDate: new Date('2024-02-28'),
    material: 'Synthetic',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Formal, Office' },
      { key: 'care', value: 'Wipe Clean' },
      { key: 'heel height', value: '3.5 inches' },
    ],
    tags: ['Elegant', 'Leg-lengthening', 'Classic'],
    notes: 'Makes legs look longer. Perfect for dresses.',
    timesWorn: 12,
    createdAt: new Date('2024-02-28'),
    updatedAt: getRandomPastDate(8),
  },
  {
    id: 'item-15',
    wardrobeId: 'wardrobe-1',
    category: 'shoes',
    name: 'Espadrille Wedges',
    brand: 'Castañer',
    color: 'Tan',
    size: '8',
    price: 120.0,
    currency: 'USD',
    purchaseDate: new Date('2024-05-01'),
    material: 'Canvas/Jute',
    images: [
      'https://images.unsplash.com/photo-1512434817904-0f4e3e6d0a7d?w=800&q=80',
      'https://images.unsplash.com/photo-1512434817904-0f4e3e6d0a7d?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Summer' },
      { key: 'occasion', value: 'Casual, Vacation' },
      { key: 'care', value: 'Spot Clean' },
    ],
    tags: ['Summery', 'Comfortable', 'Chic'],
    notes: 'Love for summer! So comfortable and stylish.',
    timesWorn: 7,
    createdAt: new Date('2024-05-01'),
    updatedAt: getRandomPastDate(5),
  },

  // ACCESSORIES
  {
    id: 'item-16',
    wardrobeId: 'wardrobe-1',
    category: 'accessory',
    name: 'Gold Hoop Earrings',
    brand: 'Mejuri',
    color: 'Gold',
    size: 'Medium',
    price: 58.0,
    currency: 'USD',
    purchaseDate: new Date('2024-01-10'),
    material: '14K Gold Plated',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Everyday, Special Occasions' },
      { key: 'care', value: 'Avoid Water' },
    ],
    tags: ['Classic', 'Versatile', 'Timeless'],
    notes: 'Never take them off. Everyday earrings!',
    timesWorn: 85,
    purchaseLink: 'https://www.mejuri.com/example',
    createdAt: new Date('2024-01-10'),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: 'item-17',
    wardrobeId: 'wardrobe-1',
    category: 'accessory',
    name: 'Silk Scarf',
    brand: 'Hermès',
    color: 'Multi',
    price: 395.0,
    currency: 'USD',
    purchaseDate: new Date('2023-12-25'),
    material: 'Silk',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Special Occasions, Travel' },
      { key: 'care', value: 'Dry Clean Only' },
      { key: 'dimensions', value: '90cm x 90cm' },
    ],
    tags: ['Luxury', 'Investment', 'Versatile'],
    notes: 'Gift from mom. Can wear as scarf, headband, or bag accessory.',
    timesWorn: 14,
    createdAt: new Date('2023-12-25'),
    updatedAt: getRandomPastDate(12),
  },
  {
    id: 'item-18',
    wardrobeId: 'wardrobe-1',
    category: 'accessory',
    name: 'Leather Belt',
    brand: 'Coach',
    color: 'Brown',
    size: 'S',
    price: 78.0,
    currency: 'USD',
    purchaseDate: new Date('2024-03-10'),
    material: 'Leather',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual, Office' },
      { key: 'care', value: 'Leather Conditioner' },
    ],
    tags: ['Classic', 'Quality', 'Essential'],
    notes: 'Great quality. Goes with everything.',
    timesWorn: 24,
    createdAt: new Date('2024-03-10'),
    updatedAt: getRandomPastDate(4),
  },
  {
    id: 'item-19',
    wardrobeId: 'wardrobe-1',
    category: 'accessory',
    name: 'Sunglasses',
    brand: 'Ray-Ban',
    color: 'Black',
    price: 153.0,
    currency: 'USD',
    purchaseDate: new Date('2024-04-20'),
    material: 'Acetate',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Summer' },
      { key: 'occasion', value: 'Casual, Travel' },
      { key: 'care', value: 'Clean with Lens Cloth' },
      { key: 'UV protection', value: '100%' },
    ],
    tags: ['Classic', 'Protective', 'Stylish'],
    notes: 'Wayfarer style. Timeless!',
    timesWorn: 35,
    createdAt: new Date('2024-04-20'),
    updatedAt: getRandomPastDate(2),
  },
  {
    id: 'item-20',
    wardrobeId: 'wardrobe-1',
    category: 'accessory',
    name: 'Statement Necklace',
    brand: 'BaubleBar',
    color: 'Gold/Crystal',
    price: 48.0,
    currency: 'USD',
    purchaseDate: new Date('2024-02-14'),
    material: 'Metal/Crystal',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Party, Date Night' },
      { key: 'care', value: 'Avoid Water' },
    ],
    tags: ['Bold', 'Eye-catching', 'Fun'],
    notes: 'Instantly elevates simple outfits.',
    timesWorn: 5,
    createdAt: new Date('2024-02-14'),
    updatedAt: getRandomPastDate(20),
  },

  // OUTERWEAR
  {
    id: 'item-21',
    wardrobeId: 'wardrobe-1',
    category: 'outerwear',
    name: 'Trench Coat',
    brand: 'Burberry',
    color: 'Beige',
    size: 'M',
    price: 1890.0,
    currency: 'USD',
    purchaseDate: new Date('2023-09-15'),
    material: 'Cotton Gabardine',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Fall' },
      { key: 'occasion', value: 'Office, Travel, Formal' },
      { key: 'care', value: 'Dry Clean Only' },
    ],
    tags: ['Classic', 'Investment', 'Timeless'],
    notes: 'Dream coat! Major investment but worth every penny.',
    timesWorn: 22,
    purchaseLink: 'https://www.burberry.com/example',
    createdAt: new Date('2023-09-15'),
    updatedAt: getRandomPastDate(5),
  },
  {
    id: 'item-22',
    wardrobeId: 'wardrobe-1',
    category: 'outerwear',
    name: 'Puffer Jacket',
    brand: 'The North Face',
    color: 'Black',
    size: 'M',
    price: 279.0,
    currency: 'USD',
    purchaseDate: new Date('2023-11-20'),
    material: 'Nylon/Down Fill',
    images: [
      'https://images.unsplash.com/photo-1548126032-079d4c214ad7?w=800&q=80',
      'https://images.unsplash.com/photo-1548126032-079d4c214ad7?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Winter' },
      { key: 'occasion', value: 'Casual, Outdoor' },
      { key: 'care', value: 'Machine Wash' },
      { key: 'insulation', value: '600-fill down' },
    ],
    tags: ['Warm', 'Functional', 'Comfortable'],
    notes: 'So warm! Perfect for cold winters.',
    timesWorn: 35,
    createdAt: new Date('2023-11-20'),
    updatedAt: getRandomPastDate(2),
  },
  {
    id: 'item-23',
    wardrobeId: 'wardrobe-1',
    category: 'outerwear',
    name: 'Denim Jacket',
    brand: "Levi's",
    color: 'Light Blue',
    size: 'M',
    price: 98.0,
    currency: 'USD',
    purchaseDate: new Date('2024-04-01'),
    material: 'Denim',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'Spring/Fall' },
      { key: 'occasion', value: 'Casual' },
      { key: 'care', value: 'Machine Wash' },
    ],
    tags: ['Classic', 'Casual', 'Versatile'],
    notes: 'Classic piece. Goes with everything!',
    timesWorn: 18,
    createdAt: new Date('2024-04-01'),
    updatedAt: getRandomPastDate(6),
  },

  // BAGS
  {
    id: 'item-24',
    wardrobeId: 'wardrobe-1',
    category: 'bag',
    name: 'Leather Tote',
    brand: 'Madewell',
    color: 'Tan',
    price: 168.0,
    currency: 'USD',
    purchaseDate: new Date('2024-01-05'),
    material: 'Leather',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Work, Travel, Everyday' },
      { key: 'care', value: 'Leather Conditioner' },
      { key: 'capacity', value: 'Large' },
    ],
    tags: ['Practical', 'Spacious', 'Elegant'],
    notes: 'Perfect work bag. Fits laptop and everything!',
    timesWorn: 48,
    createdAt: new Date('2024-01-05'),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: 'item-25',
    wardrobeId: 'wardrobe-1',
    category: 'bag',
    name: 'Crossbody Bag',
    brand: 'Kate Spade',
    color: 'Black',
    price: 298.0,
    currency: 'USD',
    purchaseDate: new Date('2023-12-10'),
    material: 'Leather',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Casual, Night Out' },
      { key: 'care', value: 'Wipe Clean' },
      { key: 'capacity', value: 'Small' },
    ],
    tags: ['Convenient', 'Chic', 'Versatile'],
    notes: 'Love for hands-free shopping and nights out.',
    timesWorn: 32,
    createdAt: new Date('2023-12-10'),
    updatedAt: getRandomPastDate(3),
  },
  {
    id: 'item-26',
    wardrobeId: 'wardrobe-1',
    category: 'bag',
    name: 'Evening Clutch',
    brand: 'Zara',
    color: 'Silver',
    price: 35.99,
    currency: 'USD',
    purchaseDate: new Date('2024-03-20'),
    material: 'Metallic Fabric',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    ],
    attributes: [
      { key: 'season', value: 'All Season' },
      { key: 'occasion', value: 'Formal, Party' },
      { key: 'care', value: 'Spot Clean' },
    ],
    tags: ['Glamorous', 'Compact', 'Special Occasion'],
    notes: 'Perfect for formal events. Just fits essentials.',
    timesWorn: 3,
    createdAt: new Date('2024-03-20'),
    updatedAt: getRandomPastDate(30),
  },
]

// Calculate categories count
const calculateCategories = (items: WardrobeItem[]) => {
  return {
    tops: items.filter((item) => item.category === 'top').length,
    bottoms: items.filter((item) => item.category === 'bottom').length,
    shoes: items.filter((item) => item.category === 'shoes').length,
    accessories: items.filter((item) => item.category === 'accessory').length,
    outerwear: items.filter((item) => item.category === 'outerwear').length,
    dresses: items.filter((item) => item.category === 'dress').length,
  }
}

// Find most worn item
const getMostWornItem = (items: WardrobeItem[]): WardrobeItem | undefined => {
  if (items.length === 0) return undefined
  return items.reduce((mostWorn, item) => (item.timesWorn > mostWorn.timesWorn ? item : mostWorn))
}

// Mock Wardrobe
export const mockWardrobe: Wardrobe = {
  id: 'wardrobe-1',
  userId: 'user-1',
  name: 'My Wardrobe',
  items: mockWardrobeItems,
  totalItems: mockWardrobeItems.length,
  categories: calculateCategories(mockWardrobeItems),
  mostWornItem: getMostWornItem(mockWardrobeItems),
  createdAt: new Date('2023-09-01'),
  updatedAt: new Date(),
}

// Mock Wardrobe Stats
export const mockWardrobeStats: WardrobeStats = {
  totalItems: mockWardrobeItems.length,
  totalOutfits: 45,
  mostWornCategory: 'top',
  averageItemPrice:
    mockWardrobeItems.reduce((sum, item) => sum + (item.price || 0), 0) / mockWardrobeItems.length,
  totalValue: mockWardrobeItems.reduce((sum, item) => sum + (item.price || 0), 0),
  itemsByColor: mockWardrobeItems.reduce(
    (acc, item) => {
      const color = item.color.toLowerCase()
      acc[color] = (acc[color] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  ),
  itemsByBrand: mockWardrobeItems.reduce(
    (acc, item) => {
      if (item.brand) {
        acc[item.brand] = (acc[item.brand] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  ),
}

// Helper Functions

export const getItemById = (id: string): WardrobeItem | undefined => {
  return mockWardrobeItems.find((item) => item.id === id)
}

export const getItemsByCategory = (category: WardrobeItem['category']): WardrobeItem[] => {
  return mockWardrobeItems.filter((item) => item.category === category)
}

export const searchItems = (query: string): WardrobeItem[] => {
  const lowerQuery = query.toLowerCase()
  return mockWardrobeItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.brand?.toLowerCase().includes(lowerQuery) ||
      item.color.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

export const filterItems = (filters: {
  category?: WardrobeItem['category']
  brand?: string
  color?: string
  season?: string
  minPrice?: number
  maxPrice?: number
}): WardrobeItem[] => {
  return mockWardrobeItems.filter((item) => {
    if (filters.category && item.category !== filters.category) return false
    if (filters.brand && item.brand !== filters.brand) return false
    if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase()))
      return false
    if (
      filters.season &&
      !item.attributes.some(
        (attr) =>
          attr.key === 'season' && attr.value.toLowerCase().includes(filters.season!.toLowerCase())
      )
    )
      return false
    if (filters.minPrice && item.price && item.price < filters.minPrice) return false
    if (filters.maxPrice && item.price && item.price > filters.maxPrice) return false
    return true
  })
}

export const sortItems = (
  items: WardrobeItem[],
  sortBy: 'date' | 'timesWorn' | 'price' | 'brand' | 'name'
): WardrobeItem[] => {
  const sorted = [...items]
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'timesWorn':
      return sorted.sort((a, b) => b.timesWorn - a.timesWorn)
    case 'price':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'brand':
      return sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}

export const getPaginatedItems = (
  items: WardrobeItem[],
  page: number,
  pageSize: number
): { items: WardrobeItem[]; hasMore: boolean } => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    hasMore: end < items.length,
  }
}

export const getAllBrands = (): string[] => {
  const brands = new Set(mockWardrobeItems.map((item) => item.brand).filter(Boolean))
  return Array.from(brands) as string[]
}

export const getAllColors = (): string[] => {
  const colors = new Set(mockWardrobeItems.map((item) => item.color))
  return Array.from(colors)
}

export const getRecentlyAddedItems = (limit: number = 6): WardrobeItem[] => {
  return [...mockWardrobeItems]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export const getMostWornItems = (limit: number = 6): WardrobeItem[] => {
  return [...mockWardrobeItems].sort((a, b) => b.timesWorn - a.timesWorn).slice(0, limit)
}
