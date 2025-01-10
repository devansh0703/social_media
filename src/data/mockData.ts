export interface ContentType {
  type: 'reel' | 'photo' | 'carousel' | 'video' | 'story' | 'live';
  duration?: number; // in seconds, for video content
  slides?: number;   // for carousel posts
}

export interface SocialMediaData {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
  date: string;
  content: ContentType;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    reactions: {
      love: number;
      haha: number;
      wow: number;
      sad: number;
      angry: number;
    };
  };
  reach: number;
  impressions: number;
  followers: number;
  followersGained: number;
  followersLost: number;
  watchTime?: number; // in seconds
  averageViewDuration?: number; // in seconds
  completionRate?: number; // percentage
  demographics: {
    ageRanges: {
      '13-17': number;
      '18-24': number;
      '25-34': number;
      '35-44': number;
      '45-54': number;
      '55+': number;
    };
    genders: {
      male: number;
      female: number;
      other: number;
    };
    topCountries: Array<{ country: string; percentage: number }>;
  };
  hashtags: string[];
  paid: boolean;
  adSpend?: number;
  roi?: number;
}

// Helper functions to generate realistic data
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const generateContentType = (): ContentType => {
  const types: ContentType['type'][] = ['reel', 'photo', 'carousel', 'video', 'story', 'live'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'reel':
      return { type, duration: randomBetween(15, 60) };
    case 'video':
      return { type, duration: randomBetween(60, 3600) };
    case 'carousel':
      return { type, slides: randomBetween(2, 10) };
    case 'live':
      return { type, duration: randomBetween(300, 3600) };
    default:
      return { type };
  }
};

const generateDemographics = () => {
  const total = 100;
  const ageRanges = {
    '13-17': randomBetween(5, 15),
    '18-24': randomBetween(20, 30),
    '25-34': randomBetween(25, 35),
    '35-44': randomBetween(15, 25),
    '45-54': randomBetween(5, 15),
    '55+': randomBetween(5, 15)
  };

  const genders = {
    male: randomBetween(30, 50),
    female: randomBetween(30, 50),
    other: randomBetween(1, 10)
  };

  const countries = [
    { country: 'United States', percentage: randomBetween(20, 40) },
    { country: 'United Kingdom', percentage: randomBetween(10, 20) },
    { country: 'India', percentage: randomBetween(10, 20) },
    { country: 'Canada', percentage: randomBetween(5, 15) },
    { country: 'Australia', percentage: randomBetween(5, 15) }
  ];

  return { ageRanges, genders, topCountries: countries };
};

const generateHashtags = () => {
  const hashtags = [
    'trending', 'viral', 'fyp', 'foryou', 'trending', 'love', 'fashion', 'beauty',
    'fitness', 'health', 'motivation', 'business', 'entrepreneur', 'marketing',
    'socialmedia', 'digital', 'creative', 'art', 'photography', 'travel'
  ];
  
  return Array.from({ length: randomBetween(3, 8) }, () => 
    hashtags[Math.floor(Math.random() * hashtags.length)]
  );
};

// Generate 1000 data points
export const mockData: SocialMediaData[] = Array.from({ length: 1000 }, (_, index) => {
  const isPaid = Math.random() > 0.8; // 20% of posts are paid
  const content = generateContentType();
  const isVideo = content.type === 'video' || content.type === 'reel' || content.type === 'live';
  const platform = ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube'][Math.floor(Math.random() * 6)] as SocialMediaData['platform'];
  
  // Base engagement multiplier based on content type
  let engagementMultiplier = 1;
  switch (content.type) {
    case 'reel':
      engagementMultiplier = 2.5;
      break;
    case 'video':
      engagementMultiplier = 2;
      break;
    case 'carousel':
      engagementMultiplier = 1.8;
      break;
    case 'live':
      engagementMultiplier = 1.5;
      break;
    default:
      engagementMultiplier = 1;
  }

  // Paid content gets additional boost
  if (isPaid) engagementMultiplier *= 1.5;

  const baseEngagement = randomBetween(100, 10000);
  
  return {
    id: `post-${index + 1}`,
    platform,
    date: new Date(2024, 0, index % 365).toISOString(),
    content,
    engagement: {
      likes: Math.floor(baseEngagement * engagementMultiplier * randomBetween(8, 12) / 10),
      comments: Math.floor(baseEngagement * engagementMultiplier * randomBetween(1, 3) / 10),
      shares: Math.floor(baseEngagement * engagementMultiplier * randomBetween(1, 2) / 10),
      saves: Math.floor(baseEngagement * engagementMultiplier * randomBetween(1, 2) / 10),
      clicks: Math.floor(baseEngagement * engagementMultiplier * randomBetween(2, 4) / 10),
      reactions: {
        love: Math.floor(baseEngagement * randomBetween(2, 4) / 10),
        haha: Math.floor(baseEngagement * randomBetween(1, 3) / 10),
        wow: Math.floor(baseEngagement * randomBetween(1, 2) / 10),
        sad: Math.floor(baseEngagement * randomBetween(0, 1) / 10),
        angry: Math.floor(baseEngagement * randomBetween(0, 1) / 10),
      },
    },
    reach: Math.floor(baseEngagement * engagementMultiplier * randomBetween(20, 30)),
    impressions: Math.floor(baseEngagement * engagementMultiplier * randomBetween(30, 40)),
    followers: 100000 + Math.floor(index * randomBetween(10, 50)),
    followersGained: randomBetween(50, 500),
    followersLost: randomBetween(10, 100),
    ...(isVideo && {
      watchTime: randomBetween(1000, 10000),
      averageViewDuration: randomBetween(10, 120),
      completionRate: randomBetween(20, 95),
    }),
    demographics: generateDemographics(),
    hashtags: generateHashtags(),
    paid: isPaid,
    ...(isPaid && {
      adSpend: randomBetween(50, 1000),
      roi: randomBetween(1, 10),
    }),
  };
});