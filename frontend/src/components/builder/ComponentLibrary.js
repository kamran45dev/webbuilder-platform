// Available component types
export const COMPONENT_TYPES = {
  HERO: 'hero',
  NAVBAR: 'navbar',
  FEATURES: 'features',
  CTA: 'cta',
  FOOTER: 'footer',
  TEXT: 'text',
  IMAGE: 'image',
  CONTACT_FORM: 'contact_form',
  TESTIMONIALS: 'testimonials',
  PRICING: 'pricing',
  GALLERY: 'gallery',
  VIDEO: 'video',
  FAQ: 'faq',
  CARDS: 'cards',
  TEAM: 'team'
}

// Default props for each component type
export const DEFAULT_PROPS = {
  [COMPONENT_TYPES.HERO]: {
    title: 'Welcome to Our Website',
    subtitle: 'Build amazing things with our platform',
    buttonText: 'Get Started',
    buttonLink: '#',
    bgColor: 'primary',
    textAlign: 'center'
  },
  [COMPONENT_TYPES.NAVBAR]: {
    brandName: 'MyBrand',
    bgColor: 'light',
    textColor: 'dark',
    links: [
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' }
    ]
  },
  [COMPONENT_TYPES.FEATURES]: {
    title: 'Our Features',
    items: [
      { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
      { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
      { icon: '💎', title: 'Premium', description: 'Premium quality' }
    ]
  },
  [COMPONENT_TYPES.CTA]: {
    title: 'Ready to get started?',
    subtitle: 'Join thousands of satisfied customers',
    buttonText: 'Sign Up Now',
    buttonLink: '#',
    bgColor: 'primary'
  },
  [COMPONENT_TYPES.FOOTER]: {
    text: '© 2024 MyBrand. All rights reserved.',
    bgColor: 'dark',
    links: [
      { text: 'Privacy', url: '/privacy' },
      { text: 'Terms', url: '/terms' }
    ]
  },
  [COMPONENT_TYPES.TEXT]: {
    content: 'Your text here...',
    align: 'left',
    size: 'normal'
  },
  [COMPONENT_TYPES.IMAGE]: {
    src: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop',
    alt: 'Placeholder image',
    width: '100%',
    align: 'center'
  },
  [COMPONENT_TYPES.CONTACT_FORM]: {
    title: 'Get in Touch',
    subtitle: 'We\'d love to hear from you',
    fields: [
      { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
      { type: 'textarea', label: 'Message', placeholder: 'Your message', required: true }
    ],
    buttonText: 'Send Message'
  },
  [COMPONENT_TYPES.TESTIMONIALS]: {
    title: 'What Our Customers Say',
    items: [
      { name: 'John Doe', role: 'CEO, Company', text: 'Amazing service! Highly recommend.', avatar: '👤' },
      { name: 'Jane Smith', role: 'Designer', text: 'Best decision we ever made.', avatar: '👤' },
      { name: 'Bob Johnson', role: 'Developer', text: 'Outstanding quality and support.', avatar: '👤' }
    ]
  },
  [COMPONENT_TYPES.PRICING]: {
    title: 'Choose Your Plan',
    plans: [
      { name: 'Basic', price: '$9', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'], highlighted: false },
      { name: 'Pro', price: '$29', period: '/month', features: ['All Basic', 'Feature 4', 'Feature 5', 'Priority Support'], highlighted: true },
      { name: 'Enterprise', price: '$99', period: '/month', features: ['All Pro', 'Custom Features', 'Dedicated Support'], highlighted: false }
    ]
  },
  [COMPONENT_TYPES.GALLERY]: {
    title: 'Gallery',
    images: [
      { src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', alt: 'Image 1' },
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', alt: 'Image 2' },
      { src: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop', alt: 'Image 3' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', alt: 'Image 4' }
    ],
    columns: 3
  },
  [COMPONENT_TYPES.VIDEO]: {
    title: 'Watch Our Video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    aspectRatio: '16:9'
  },
  [COMPONENT_TYPES.FAQ]: {
    title: 'Frequently Asked Questions',
    items: [
      { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee.' },
      { question: 'How long does shipping take?', answer: 'Shipping typically takes 3-5 business days.' },
      { question: 'Do you offer customer support?', answer: 'Yes! Our support team is available 24/7.' }
    ]
  },
  [COMPONENT_TYPES.CARDS]: {
    title: 'Our Services',
    items: [
      { icon: '🚀', title: 'Fast Delivery', description: 'Get your product in no time' },
      { icon: '💪', title: 'Quality', description: 'Top-notch quality guaranteed' },
      { icon: '🎯', title: 'Precision', description: 'Accurate and reliable' }
    ],
    columns: 3
  },
  [COMPONENT_TYPES.TEAM]: {
    title: 'Meet Our Team',
    members: [
      { name: 'Alice Johnson', role: 'CEO & Founder', image: 'https://i.pravatar.cc/300?img=1', bio: 'Passionate about innovation' },
      { name: 'Bob Smith', role: 'CTO', image: 'https://i.pravatar.cc/300?img=2', bio: 'Tech enthusiast and problem solver' },
      { name: 'Carol White', role: 'Designer', image: 'https://i.pravatar.cc/300?img=3', bio: 'Creating beautiful experiences' }
    ]
  }
}

// Component metadata for the sidebar
export const COMPONENT_LIST = [
  // Basic
  { type: COMPONENT_TYPES.HERO, label: 'Hero Section', icon: '🎯', category: 'Basic' },
  { type: COMPONENT_TYPES.NAVBAR, label: 'Navigation Bar', icon: '📱', category: 'Basic' },
  { type: COMPONENT_TYPES.TEXT, label: 'Text Block', icon: '📝', category: 'Basic' },
  { type: COMPONENT_TYPES.IMAGE, label: 'Image', icon: '🖼️', category: 'Basic' },
  { type: COMPONENT_TYPES.CTA, label: 'Call to Action', icon: '📣', category: 'Basic' },
  { type: COMPONENT_TYPES.FOOTER, label: 'Footer', icon: '📄', category: 'Basic' },
  
  // Content
  { type: COMPONENT_TYPES.FEATURES, label: 'Features Grid', icon: '⭐', category: 'Content' },
  { type: COMPONENT_TYPES.CARDS, label: 'Card Grid', icon: '🃏', category: 'Content' },
  { type: COMPONENT_TYPES.TESTIMONIALS, label: 'Testimonials', icon: '💬', category: 'Content' },
  { type: COMPONENT_TYPES.TEAM, label: 'Team Members', icon: '👥', category: 'Content' },
  { type: COMPONENT_TYPES.FAQ, label: 'FAQ', icon: '❓', category: 'Content' },
  
  // Media
  { type: COMPONENT_TYPES.GALLERY, label: 'Image Gallery', icon: '🖼️', category: 'Media' },
  { type: COMPONENT_TYPES.VIDEO, label: 'Video Embed', icon: '🎥', category: 'Media' },
  
  // Forms
  { type: COMPONENT_TYPES.CONTACT_FORM, label: 'Contact Form', icon: '✉️', category: 'Forms' },
  
  // Commerce
  { type: COMPONENT_TYPES.PRICING, label: 'Pricing Table', icon: '💰', category: 'Commerce' }
]

// Pre-built page templates
export const PAGE_TEMPLATES = {
  LANDING: {
    name: 'Landing Page',
    icon: '🚀',
    components: [
      { type: COMPONENT_TYPES.NAVBAR, props: DEFAULT_PROPS[COMPONENT_TYPES.NAVBAR] },
      { type: COMPONENT_TYPES.HERO, props: DEFAULT_PROPS[COMPONENT_TYPES.HERO] },
      { type: COMPONENT_TYPES.FEATURES, props: DEFAULT_PROPS[COMPONENT_TYPES.FEATURES] },
      { type: COMPONENT_TYPES.CTA, props: DEFAULT_PROPS[COMPONENT_TYPES.CTA] },
      { type: COMPONENT_TYPES.FOOTER, props: DEFAULT_PROPS[COMPONENT_TYPES.FOOTER] }
    ]
  },
  ABOUT: {
    name: 'About Page',
    icon: '👥',
    components: [
      { type: COMPONENT_TYPES.NAVBAR, props: DEFAULT_PROPS[COMPONENT_TYPES.NAVBAR] },
      { type: COMPONENT_TYPES.TEXT, props: { ...DEFAULT_PROPS[COMPONENT_TYPES.TEXT], content: 'About Us', size: 'large', align: 'center' } },
      { type: COMPONENT_TYPES.TEAM, props: DEFAULT_PROPS[COMPONENT_TYPES.TEAM] },
      { type: COMPONENT_TYPES.FOOTER, props: DEFAULT_PROPS[COMPONENT_TYPES.FOOTER] }
    ]
  },
  PRICING: {
    name: 'Pricing Page',
    icon: '💰',
    components: [
      { type: COMPONENT_TYPES.NAVBAR, props: DEFAULT_PROPS[COMPONENT_TYPES.NAVBAR] },
      { type: COMPONENT_TYPES.PRICING, props: DEFAULT_PROPS[COMPONENT_TYPES.PRICING] },
      { type: COMPONENT_TYPES.FAQ, props: DEFAULT_PROPS[COMPONENT_TYPES.FAQ] },
      { type: COMPONENT_TYPES.FOOTER, props: DEFAULT_PROPS[COMPONENT_TYPES.FOOTER] }
    ]
  },
  CONTACT: {
    name: 'Contact Page',
    icon: '✉️',
    components: [
      { type: COMPONENT_TYPES.NAVBAR, props: DEFAULT_PROPS[COMPONENT_TYPES.NAVBAR] },
      { type: COMPONENT_TYPES.CONTACT_FORM, props: DEFAULT_PROPS[COMPONENT_TYPES.CONTACT_FORM] },
      { type: COMPONENT_TYPES.FOOTER, props: DEFAULT_PROPS[COMPONENT_TYPES.FOOTER] }
    ]
  }
}