import { SocialPost } from '../../domain/entities/Social'

// Mock users for variety
export const mockUsers = [
  {
    id: '1',
    username: 'emily_style',
    fullName: 'Emily Rodriguez',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    isFollowing: true,
  },
  {
    id: '2',
    username: 'alex_fashion',
    fullName: 'Alex Chen',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    isFollowing: true,
  },
  {
    id: '3',
    username: 'sophia_chic',
    fullName: 'Sophia Martinez',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    isFollowing: true,
  },
  {
    id: '4',
    username: 'marcus_threads',
    fullName: 'Marcus Johnson',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    isFollowing: true,
  },
  {
    id: '5',
    username: 'luna_wardrobe',
    fullName: 'Luna Park',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    isFollowing: false,
  },
  {
    id: '6',
    username: 'david_looks',
    fullName: 'David Kim',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    isFollowing: false,
  },
  {
    id: '7',
    username: 'isabella_outfit',
    fullName: 'Isabella Santos',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    isFollowing: false,
  },
  {
    id: '8',
    username: 'ryan_street',
    fullName: 'Ryan Taylor',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    isFollowing: false,
  },
  {
    id: '9',
    username: 'mia_aesthetic',
    fullName: 'Mia Anderson',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    isFollowing: true,
  },
  {
    id: '10',
    username: 'oliver_dapper',
    fullName: 'Oliver Brown',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    isFollowing: false,
  },
]

// Helper to get random date in the past
const getRandomPastDate = (hoursAgo: number) => {
  const now = new Date()
  now.setHours(now.getHours() - hoursAgo)
  return now
}

// "For You" Feed - Personalized mix of content
export const forYouPosts: SocialPost[] = [
  {
    id: '1',
    userId: '1',
    author: {
      id: '1',
      username: 'emily_style',
      fullName: 'Emily Rodriguez',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
    caption:
      'Perfect summer outfit for brunch with the girls! ☀️💕 Loving this flowy dress paired with minimal accessories.',
    tags: ['OOTD', 'SummerStyle', 'BrunchLook', 'Minimalist'],
    likes: 1234,
    comments: 45,
    shares: 12,
    saves: 234,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(2),
    updatedAt: getRandomPastDate(2),
  },
  {
    id: '2',
    userId: '5',
    author: {
      id: '5',
      username: 'luna_wardrobe',
      fullName: 'Luna Park',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    },
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=800&q=80',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    ],
    caption:
      'Monochrome magic ✨ Sometimes keeping it simple is the most powerful statement. Black on black never fails.',
    tags: ['Monochrome', 'StreetStyle', 'AllBlack', 'Minimalist'],
    likes: 2847,
    comments: 89,
    shares: 34,
    saves: 567,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(5),
    updatedAt: getRandomPastDate(5),
  },
  {
    id: '3',
    userId: '6',
    author: {
      id: '6',
      username: 'david_looks',
      fullName: 'David Kim',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    images: [
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
      'https://images.unsplash.com/photo-1483118714900-540cf339fd46?w=800&q=80',
    ],
    caption:
      'Casual Friday but make it fashion 🔥 Oversized blazer paired with sneakers - comfort meets style!',
    tags: ['MensFashion', 'CasualFriday', 'StreetWear', 'SmartCasual'],
    likes: 892,
    comments: 34,
    shares: 8,
    saves: 156,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(8),
    updatedAt: getRandomPastDate(8),
  },
  {
    id: '4',
    userId: '7',
    author: {
      id: '7',
      username: 'isabella_outfit',
      fullName: 'Isabella Santos',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    },
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'],
    caption:
      "Vintage vibes only 🌸 Found this gem at a thrift store and I'm obsessed! Sustainable fashion is the way.",
    tags: ['VintageFashion', 'ThriftFinds', 'SustainableFashion', 'RetroStyle'],
    likes: 1567,
    comments: 67,
    shares: 23,
    saves: 389,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(12),
    updatedAt: getRandomPastDate(12),
  },
  {
    id: '5',
    userId: '10',
    author: {
      id: '10',
      username: 'oliver_dapper',
      fullName: 'Oliver Brown',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    },
    images: [
      'https://images.unsplash.com/photo-1617127365476-25a9a4ff0036?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    caption:
      'Tailored to perfection 👔 Nothing beats a well-fitted suit. Details in the second slide!',
    tags: ['SuitUp', 'FormalWear', 'MensFashion', 'TailoredStyle'],
    likes: 2134,
    comments: 56,
    shares: 19,
    saves: 445,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(18),
    updatedAt: getRandomPastDate(18),
  },
  {
    id: '6',
    userId: '8',
    author: {
      id: '8',
      username: 'ryan_street',
      fullName: 'Ryan Taylor',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    },
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'],
    caption:
      'Street style essentials 🛹 Keeping it real with the classics - denim, white tee, and fresh kicks.',
    tags: ['StreetStyle', 'Casual', 'Denim', 'Sneakerhead'],
    likes: 3421,
    comments: 112,
    shares: 45,
    saves: 678,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(24),
    updatedAt: getRandomPastDate(24),
  },
]

// "Following" Feed - Posts from users you follow
export const followingPosts: SocialPost[] = [
  {
    id: '101',
    userId: '1',
    author: {
      id: '1',
      username: 'emily_style',
      fullName: 'Emily Rodriguez',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
    ],
    caption:
      'New week, new wardrobe goals! 💫 Just organized my closet and feeling so inspired. Swipe for before & after!',
    tags: ['Wardrobe', 'Organization', 'FashionInspo', 'CleanCloset'],
    likes: 1891,
    comments: 78,
    shares: 25,
    saves: 412,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(1),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: '102',
    userId: '2',
    author: {
      id: '2',
      username: 'alex_fashion',
      fullName: 'Alex Chen',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
    caption:
      "Color blocking done right 🎨 Don't be afraid to mix bold colors! This combo got me so many compliments today.",
    tags: ['ColorBlock', 'BoldFashion', 'StyleTips', 'FashionForward'],
    likes: 2234,
    comments: 91,
    shares: 38,
    saves: 523,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(3),
    updatedAt: getRandomPastDate(3),
  },
  {
    id: '103',
    userId: '3',
    author: {
      id: '3',
      username: 'sophia_chic',
      fullName: 'Sophia Martinez',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    },
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    ],
    caption: 'Date night outfit ideas 💕 Which look is your favorite? 1, 2, or 3? Comment below!',
    tags: ['DateNight', 'EveningWear', 'Elegant', 'OutfitIdeas'],
    likes: 3567,
    comments: 234,
    shares: 67,
    saves: 891,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(6),
    updatedAt: getRandomPastDate(6),
  },
  {
    id: '104',
    userId: '4',
    author: {
      id: '4',
      username: 'marcus_threads',
      fullName: 'Marcus Johnson',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    },
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'],
    caption:
      "Business casual mastered 💼 Pro tip: invest in quality basics. They'll last forever and always look sharp!",
    tags: ['BusinessCasual', 'WorkWear', 'MensFashion', 'Professional'],
    likes: 1678,
    comments: 45,
    shares: 29,
    saves: 334,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(10),
    updatedAt: getRandomPastDate(10),
  },
  {
    id: '105',
    userId: '9',
    author: {
      id: '9',
      username: 'mia_aesthetic',
      fullName: 'Mia Anderson',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    },
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80',
    ],
    caption:
      'Cozy season is here! 🍂 Oversized sweaters and boots are my happy place. Who else is loving fall fashion?',
    tags: ['FallFashion', 'CozyStyle', 'Autumn', 'SweaterWeather'],
    likes: 2945,
    comments: 156,
    shares: 52,
    saves: 734,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(14),
    updatedAt: getRandomPastDate(14),
  },
  {
    id: '106',
    userId: '2',
    author: {
      id: '2',
      username: 'alex_fashion',
      fullName: 'Alex Chen',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    images: ['https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80'],
    caption:
      'Layering game strong 🧥 The key to transitional weather dressing. Details on my blog!',
    tags: ['Layering', 'TransitionalStyle', 'FashionTips', 'StreetStyle'],
    likes: 1823,
    comments: 67,
    shares: 31,
    saves: 445,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(20),
    updatedAt: getRandomPastDate(20),
  },
]

// "Trending" Feed - High engagement posts
export const trendingPosts: SocialPost[] = [
  {
    id: '201',
    userId: '8',
    author: {
      id: '8',
      username: 'ryan_street',
      fullName: 'Ryan Taylor',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    },
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80',
    ],
    caption:
      '🔥 HOW TO STYLE WHITE SNEAKERS - 3 WAYS 🔥 Which fit is your go-to? This post blew up on TikTok so sharing here too!',
    tags: ['SneakerStyle', 'Viral', 'StyleGuide', 'WhiteSneakers', 'Trending'],
    likes: 15234,
    comments: 892,
    shares: 456,
    saves: 3421,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(4),
    updatedAt: getRandomPastDate(4),
  },
  {
    id: '202',
    userId: '7',
    author: {
      id: '7',
      username: 'isabella_outfit',
      fullName: 'Isabella Santos',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    },
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    ],
    caption:
      'THRIFT HAUL OF THE CENTURY! 😱 Spent $50 and got 8 amazing pieces. Sustainable fashion FTW! Full video on my YouTube 🔗',
    tags: ['ThriftHaul', 'Sustainable', 'Vintage', 'BudgetFashion', 'Trending'],
    likes: 23456,
    comments: 1245,
    shares: 789,
    saves: 5678,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(2),
    updatedAt: getRandomPastDate(2),
  },
  {
    id: '203',
    userId: '5',
    author: {
      id: '5',
      username: 'luna_wardrobe',
      fullName: 'Luna Park',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    },
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'],
    caption:
      "The $20 dress that looks like a million bucks 💸✨ Y'all asked for affordable fashion, so here it is! Link in bio.",
    tags: ['BudgetFashion', 'AffordableStyle', 'DressUnder50', 'Trending'],
    likes: 18723,
    comments: 967,
    shares: 523,
    saves: 4231,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(1),
    updatedAt: getRandomPastDate(1),
  },
  {
    id: '204',
    userId: '10',
    author: {
      id: '10',
      username: 'oliver_dapper',
      fullName: 'Oliver Brown',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    },
    images: [
      'https://images.unsplash.com/photo-1617127365476-25a9a4ff0036?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    caption:
      "GROOM STYLE GUIDE 🤵 Planning your wedding? Here's everything you need to know about choosing the perfect suit! Save this!",
    tags: ['WeddingStyle', 'GroomFashion', 'SuitStyle', 'Trending', 'WeddingPlanning'],
    likes: 12890,
    comments: 456,
    shares: 678,
    saves: 3892,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(3),
    updatedAt: getRandomPastDate(3),
  },
  {
    id: '205',
    userId: '3',
    author: {
      id: '3',
      username: 'sophia_chic',
      fullName: 'Sophia Martinez',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    },
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    ],
    caption:
      'CAPSULE WARDROBE 2024 ✨ Only 30 pieces, infinite outfits! This changed my life. Comment "GUIDE" for the free PDF!',
    tags: ['CapsuleWardrobe', 'Minimalist', 'CapsuleCloset', 'Trending', 'WardrobeEssentials'],
    likes: 34567,
    comments: 2134,
    shares: 1234,
    saves: 8923,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(5),
    updatedAt: getRandomPastDate(5),
  },
  {
    id: '206',
    userId: '6',
    author: {
      id: '6',
      username: 'david_looks',
      fullName: 'David Kim',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    images: ['https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80'],
    caption:
      "THE PERFECT BUSINESS CASUAL OUTFIT FORMULA 📊 Follow this and you'll never stress about work outfits again!",
    tags: ['BusinessCasual', 'WorkWear', 'StyleFormula', 'Trending', 'OfficeStyle'],
    likes: 16789,
    comments: 734,
    shares: 445,
    saves: 4567,
    isLiked: false,
    isSaved: false,
    privacy: 'public',
    createdAt: getRandomPastDate(6),
    updatedAt: getRandomPastDate(6),
  },
]

// Helper function to get posts by feed type
export const getPostsByFeedType = (feedType: 'forYou' | 'following' | 'trending'): SocialPost[] => {
  switch (feedType) {
    case 'forYou':
      return forYouPosts
    case 'following':
      return followingPosts
    case 'trending':
      return trendingPosts
    default:
      return forYouPosts
  }
}

// Helper to simulate pagination
export const getPaginatedPosts = (
  feedType: 'forYou' | 'following' | 'trending',
  offset: number = 0,
  limit: number = 10
): SocialPost[] => {
  const posts = getPostsByFeedType(feedType)
  return posts.slice(offset, offset + limit)
}

// Helper to get user by ID
export const getUserById = (userId: string) => {
  return mockUsers.find((user) => user.id === userId)
}

// Helper to toggle follow status
export const toggleUserFollow = (userId: string): boolean => {
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.isFollowing = !user.isFollowing
    return user.isFollowing
  }
  return false
}
