import { Product, StoryCategoryContent, StoryCategoryKey } from './types';

export type StoryGender = 'men' | 'women';

export interface StoryCategory {
  key: StoryCategoryKey;
  label: string;
  eyebrow: string;
  description: string;
  cta: string;
  categories: string[];
  imageFallback: string;
  images: Partial<Record<StoryGender | 'default', string>>;
  genders?: Partial<Record<StoryGender, string[]>>;
  subcategories?: string[];
}

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    key: 'uppers',
    label: 'Uppers',
    eyebrow: 'Sharp layers',
    description: 'Shirts, jackets, tees & layers',
    cta: 'Shop Uppers',
    categories: ['TOP', 'SHIRTS', 'KNITWEAR', 'OUTERWEAR'],
    imageFallback: '/category/women/uppers.png',
    images: {
      men: '/category/men/uppers.png',
      women: '/category/women/uppers.png'
    },
    genders: {
      men: STANDARD_SIZES,
      women: STANDARD_SIZES
    }
  },
  {
    key: 'lowers',
    label: 'Lowers',
    eyebrow: 'Tailored ease',
    description: 'Trousers, denim & everyday fits',
    cta: 'Shop Lowers',
    categories: ['BOTTOM'],
    imageFallback: '/category/women/lowers.png',
    images: {
      men: '/category/men/lowers.png',
      women: '/category/women/lowers.png'
    },
    genders: {
      men: ['28', '30', '32', '34', '36', '38', '40'],
      women: ['26', '28', '30', '32', '34', '36', '38']
    }
  },
  {
    key: 'dresses',
    label: 'Dresses',
    eyebrow: 'Evening lines',
    description: 'Statement silhouettes for women',
    cta: 'Shop Dresses',
    categories: ['DRESSES'],
    imageFallback: '/category/women/dresses.png',
    images: {
      women: '/category/women/dresses.png'
    },
    genders: {
      women: STANDARD_SIZES
    }
  },
  {
    key: 'co-ords',
    label: 'Co-ords',
    eyebrow: 'Matched sets',
    description: 'Matching sets for effortless style',
    cta: 'Shop Co-ords',
    categories: ['CO-ORDS', 'COORDS', 'SETS'],
    imageFallback: '/category/women/co-ords.png',
    images: {
      men: '/category/men/co-ords.png',
      women: '/category/women/co-ords.png'
    },
    genders: {
      men: STANDARD_SIZES,
      women: STANDARD_SIZES
    }
  },
  {
    key: 'footwear',
    label: 'Footwear',
    eyebrow: 'Grounded polish',
    description: 'Sneakers, shoes & premium pairs',
    cta: 'Shop Footwear',
    categories: ['SHOES', 'FOOTWEAR'],
    imageFallback: '/category/women/footwear.png',
    images: {
      men: '/category/men/footwear.png',
      women: '/category/women/footwear.png'
    },
    genders: {
      men: ['6', '7', '8', '9', '10', '11', '12'],
      women: ['3', '4', '5', '6', '7', '8', '9', '10']
    }
  },
  {
    key: 'accessories',
    label: 'Accessories',
    eyebrow: 'Finishing codes',
    description: 'Socks and finishing details',
    cta: 'Shop Accessories',
    categories: ['ACCESSORY', 'ACCESSORIES', 'SOCKS'],
    imageFallback: '/category/accessories.png',
    images: {
      default: '/category/accessories.png'
    },
    subcategories: ['Socks']
  },
  {
    key: 'inners',
    label: 'Inners',
    eyebrow: 'Daily foundation',
    description: 'Everyday comfort essentials',
    cta: 'Shop Inners',
    categories: ['INNER', 'INNERS', 'UNDERWEAR'],
    imageFallback: '/category/women/inners.png',
    images: {
      men: '/category/men/inners.png',
      women: '/category/women/inners.png'
    },
    genders: {
      men: [],
      women: []
    }
  }
];

export const LEGACY_CATEGORY_ALIASES: Partial<Record<string, StoryCategoryKey>> = {
  bottoms: 'lowers',
  cords: 'co-ords'
};

export const getStoryCategory = (key: StoryCategoryKey) =>
  STORY_CATEGORIES.find((category) => category.key === key) || STORY_CATEGORIES[0];

export const mergeStoryCategoryContent = (overrides: StoryCategoryContent[] = []) => {
  const overrideMap = new Map(overrides.map((category) => [category.key, category]));

  return STORY_CATEGORIES.map((category) => {
    const override = overrideMap.get(category.key);
    if (!override) return category;

    return {
      ...category,
      ...override,
      categories: override.categories?.length ? override.categories : category.categories,
      imageFallback: override.imageFallback || category.imageFallback,
      images: {
        ...category.images,
        ...override.images
      },
      genders: category.genders,
      subcategories: override.subcategories?.length ? override.subcategories : category.subcategories
    };
  });
};

export const getStoryCategoryFromList = (categories: StoryCategory[], key: StoryCategoryKey) =>
  categories.find((category) => category.key === key) || categories[0] || STORY_CATEGORIES[0];

export const getCategoryImage = (category: StoryCategory, selectedGender?: StoryGender | 'all') => {
  if (selectedGender && selectedGender !== 'all' && category.images[selectedGender]) {
    return category.images[selectedGender] || category.imageFallback;
  }

  return category.images.default || category.images.women || category.images.men || category.imageFallback;
};

export const filterProductsForStoryCategory = (
  products: Product[],
  key: StoryCategoryKey,
  categories: StoryCategory[] = STORY_CATEGORIES
) => {
  const category = getStoryCategoryFromList(categories, key);
  return products.filter((product) => category.categories.includes(product.category.toUpperCase()));
};
