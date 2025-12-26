
import { Voucher, Product } from './types';

export const VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    provider: 'Swiggy',
    amount: 250,
    cost: 250,
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
    description: '₹250 Food Delivery Credit'
  },
  {
    id: 'v2',
    provider: 'Amazon India',
    amount: 500,
    cost: 500,
    category: 'SHOPPING',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    description: '₹500 Online Shopping Voucher'
  },
  {
    id: 'v3',
    provider: 'Zomato',
    amount: 300,
    cost: 300,
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
    description: '₹300 Restaurant Dining Voucher'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cold Pepsi (500ml)',
    price: 40, 
    cashPrice: 50.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1629203851022-39c642378c0f?auto=format&fit=crop&q=80&w=400',
    stock: 15
  },
  {
    id: 'p2',
    name: 'Coca-Cola Zero (PET)',
    price: 40,
    cashPrice: 50.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    stock: 12
  },
  {
    id: 'p3',
    name: 'Lays Magic Masala',
    price: 20,
    cashPrice: 30.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400',
    stock: 20
  },
  {
    id: 'p3-1',
    name: 'Bingo! Mad Angles',
    price: 20,
    cashPrice: 30.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1600490033605-3de4ef2e8251?auto=format&fit=crop&q=80&w=400',
    stock: 22
  },
  {
    id: 'p3-2',
    name: 'Pringles Original',
    price: 80,
    cashPrice: 110.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1585238341267-1cfec2046a55?auto=format&fit=crop&q=80&w=400',
    stock: 10
  },
  {
    id: 'p3-3',
    name: 'Uncle Chipps (Plain)',
    price: 20,
    cashPrice: 30.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1528751011213-98006e001f30?auto=format&fit=crop&q=80&w=400',
    stock: 15
  },
  {
    id: 'p3-4',
    name: 'Haldiram Aloo Bhujia',
    price: 15,
    cashPrice: 20.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=400',
    stock: 30
  },
  {
    id: 'p4',
    name: 'Dairy Milk Silk',
    price: 60,
    cashPrice: 80.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
    stock: 8
  },
  {
    id: 'p4-1',
    name: 'Dairy Milk Fruit & Nut',
    price: 45,
    cashPrice: 60.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400',
    stock: 12
  },
  {
    id: 'p4-2',
    name: 'Dairy Milk Crackle',
    price: 45,
    cashPrice: 60.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1623156323174-0d8a6f5e4347?auto=format&fit=crop&q=80&w=400',
    stock: 10
  },
  {
    id: 'p5',
    name: 'Frooti Juice',
    price: 15,
    cashPrice: 20.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1622415867106-94644da872be?auto=format&fit=crop&q=80&w=400',
    stock: 10
  },
  {
    id: 'p6',
    name: 'Kurkure Masala Munch',
    price: 15,
    cashPrice: 20.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1600490033605-3de4ef2e8251?auto=format&fit=crop&q=80&w=400',
    stock: 25
  },
  {
    id: 'p7',
    name: 'Maggi Cuppa Noodles',
    price: 35,
    cashPrice: 45.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1612927608282-b280ff175940?auto=format&fit=crop&q=80&w=400',
    stock: 18
  },
  {
    id: 'p8',
    name: 'Red Bull Energy',
    price: 90,
    cashPrice: 115.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1622415869046-df6b80327429?auto=format&fit=crop&q=80&w=400',
    stock: 10
  },
  {
    id: 'p9',
    name: 'Sprite (600ml)',
    price: 35,
    cashPrice: 45.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1625772290748-39126d79495e?auto=format&fit=crop&q=80&w=400',
    stock: 20
  },
  {
    id: 'p10',
    name: 'Roasted Cashews',
    price: 40,
    cashPrice: 60.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1509911596765-ca5c2921a221?auto=format&fit=crop&q=80&w=400',
    stock: 15
  },
  {
    id: 'p11',
    name: 'Bourbon Biscuits',
    price: 20,
    cashPrice: 30.00,
    category: 'SNACK',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400',
    stock: 30
  },
  {
    id: 'p12',
    name: 'Maaza Mango (250ml)',
    price: 15,
    cashPrice: 20.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=400',
    stock: 25
  },
  {
    id: 'p13',
    name: 'Thums Up (250ml PET)',
    price: 15,
    cashPrice: 20.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=400',
    stock: 18
  },
  {
    id: 'p14',
    name: 'Bisleri Water (500ml)',
    price: 5,
    cashPrice: 10.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1616118132284-3dec9aa1584c?auto=format&fit=crop&q=80&w=400',
    stock: 50
  },
  {
    id: 'p15',
    name: 'Limca (PET)',
    price: 30,
    cashPrice: 40.00,
    category: 'DRINK',
    image: 'https://images.unsplash.com/photo-1625772290748-39126d79495e?auto=format&fit=crop&q=80&w=400',
    stock: 10
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
