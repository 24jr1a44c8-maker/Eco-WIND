
import { Voucher } from './types';

export const VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    provider: 'UberEats',
    amount: 15,
    cost: 150,
    category: 'FOOD',
    image: 'https://picsum.photos/seed/food1/400/300',
    description: '$15 Food Delivery Credit'
  },
  {
    id: 'v2',
    provider: 'Amazon',
    amount: 10,
    cost: 100,
    category: 'SHOPPING',
    image: 'https://picsum.photos/seed/shop1/400/300',
    description: '$10 Online Shopping Voucher'
  },
  {
    id: 'v3',
    provider: 'Zomato',
    amount: 20,
    cost: 180,
    category: 'FOOD',
    image: 'https://picsum.photos/seed/food2/400/300',
    description: '$20 Restaurant Dining Voucher'
  },
  {
    id: 'v4',
    provider: 'Westfield',
    amount: 50,
    cost: 450,
    category: 'MALL',
    image: 'https://picsum.photos/seed/mall1/400/300',
    description: '$50 Mall Shopping Card'
  },
  {
    id: 'v5',
    provider: 'Walmart',
    amount: 25,
    cost: 220,
    category: 'SHOPPING',
    image: 'https://picsum.photos/seed/shop2/400/300',
    description: '$25 Grocery Voucher'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  PLASTIC: 'bg-blue-100 text-blue-700',
  GLASS: 'bg-emerald-100 text-emerald-700',
  METAL: 'bg-gray-100 text-gray-700',
  PAPER: 'bg-amber-100 text-amber-700',
  ELECTRONICS: 'bg-purple-100 text-purple-700',
  UNKNOWN: 'bg-red-100 text-red-700'
};
