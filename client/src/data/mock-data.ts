export interface Property {
  id: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  type: 'sale' | 'rent';
  status: string;
  image: string;
}

export interface Testimonial {
  id: string;
  content: string;
  clientName: string;
  clientRole: string;
  rating: number;
  image: string;
}

export interface ServiceArea {
  name: string;
  description: string;
}

export const properties: Property[] = [
  {
    id: '1',
    price: '$485,000',
    address: '1234 Maple Street, Downtown',
    bedrooms: '4',
    bathrooms: '3',
    sqft: '2,400',
    type: 'sale',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
  },
  {
    id: '2',
    price: '$2,200/mo',
    address: '5678 Oak Avenue, Riverside',
    bedrooms: '3',
    bathrooms: '2',
    sqft: '1,800',
    type: 'rent',
    status: 'For Rent',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
  },
  {
    id: '3',
    price: '$395,000',
    address: '9876 Pine Lane, Westside',
    bedrooms: '3',
    bathrooms: '2.5',
    sqft: '2,100',
    type: 'sale',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    content: "Kevin Hensley made buying our first home such a smooth experience. His knowledge of the local market and attention to detail gave us confidence throughout the entire process.",
    clientName: "Sarah",
    clientRole: "First-time Buyer",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=faces"
  },
  {
    id: '2',
    content: "As an investor, I've worked with Kevin Hensley on multiple properties. His property management service is top-notch - professional, responsive, and always looking out for my investment.",
    clientName: "Chuck",
    clientRole: "Property Investor",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
  },
  {
    id: '3',
    content: "We've rented through Kevin Hensley for three years now. Any maintenance issues are handled promptly, and communication is always clear and professional. Highly recommended!",
    clientName: "Emma",
    clientRole: "Long-term Tenant",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
  },
  {
    id: '4',
    content: "Kevin Hensley helped us sell our home in just two weeks! His marketing strategy and pricing were spot on. We couldn't be happier with the results and his professional approach.",
    clientName: "David & Lisa",
    clientRole: "Home Sellers",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
  }
];

export const serviceAreas: ServiceArea[] = [
  { name: "Middletown", description: "Growing Community" },
  { name: "Smyrna", description: "Historic Charm" },
  { name: "Bear", description: "Family Friendly" },
  { name: "Newark", description: "University Town" },
  { name: "New Castle County", description: "Diverse Options" },
  { name: "Kent County", description: "Rural & Suburban" }
];

export const agentInfo = {
  name: "Kevin Hensley",
  yearsExperience: "35+",
  transactionCount: "500+",
  title: "Associate Broker",
  brokerage: "RE/MAX Eagle Realty",
  licenseNumber: "#324709"
};

export const contactInfo = {
  phone: "(302) 218-0130",
  directPhone: "(302) 273-0057",
  email: "kevin@hensleys-homes.com",
  website: "https://www.hensleyshomes.com",
  address: "5609 DuPont Pkwy Ste 11\nSmyrna, DE 19977"
};
