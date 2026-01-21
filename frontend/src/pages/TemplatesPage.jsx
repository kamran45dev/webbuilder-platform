import { useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Nav, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Full website templates with actual component layouts
const WEBSITE_TEMPLATES = {
  STARTUP: {
    name: 'Startup Landing',
    category: 'Business',
    description: 'Perfect for tech startups and SaaS products',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    pages: ['Home', 'Features', 'Pricing', 'Contact'],
    color: 'primary',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'StartupName', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Features', url: '/features' }, { text: 'Pricing', url: '/pricing' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'hero', props: { title: 'Build Your Startup Faster', subtitle: 'The all-in-one platform for modern startups', buttonText: 'Get Started Free', buttonLink: '#', bgColor: 'primary', textAlign: 'center' } },
        { type: 'features', props: { title: 'Why Choose Us', items: [{ icon: '⚡', title: 'Fast Setup', description: 'Get started in minutes, not days' }, { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security built-in' }, { icon: '📈', title: 'Scalable', description: 'Grows with your business' }] } },
        { type: 'cta', props: { title: 'Ready to Launch?', subtitle: 'Join thousands of successful startups', buttonText: 'Start Free Trial', buttonLink: '#', bgColor: 'primary' } },
        { type: 'footer', props: { text: '© 2024 StartupName. All rights reserved.', bgColor: 'dark', links: [{ text: 'Privacy', url: '/privacy' }, { text: 'Terms', url: '/terms' }] } }
      ],
      'Features': [
        { type: 'navbar', props: { brandName: 'StartupName', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Features', url: '/features' }] } },
        { type: 'text', props: { content: 'Our Features', size: 'large', align: 'center' } },
        { type: 'cards', props: { title: 'Everything You Need', items: [{ icon: '🚀', title: 'Fast', description: 'Lightning speed' }, { icon: '💪', title: 'Powerful', description: 'Enterprise features' }, { icon: '🎯', title: 'Focused', description: 'Built for startups' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 StartupName', bgColor: 'dark', links: [] } }
      ],
      'Pricing': [
        { type: 'navbar', props: { brandName: 'StartupName', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Pricing', url: '/pricing' }] } },
        { type: 'pricing', props: { title: 'Simple Pricing', plans: [{ name: 'Starter', price: '$9', period: '/mo', features: ['Feature 1', 'Feature 2'], highlighted: false }, { name: 'Pro', price: '$29', period: '/mo', features: ['All Starter', 'Feature 3', 'Priority Support'], highlighted: true }] } },
        { type: 'footer', props: { text: '© 2024 StartupName', bgColor: 'dark', links: [] } }
      ],
      'Contact': [
        { type: 'navbar', props: { brandName: 'StartupName', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'contact_form', props: { title: 'Get In Touch', subtitle: 'We\'d love to hear from you', buttonText: 'Send Message', fields: [{ type: 'text', label: 'Name', placeholder: 'Your name', required: true }, { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true }, { type: 'textarea', label: 'Message', placeholder: 'Your message', required: true }] } },
        { type: 'footer', props: { text: '© 2024 StartupName', bgColor: 'dark', links: [] } }
      ]
    }
  },
  AGENCY: {
    name: 'Creative Agency',
    category: 'Business',
    description: 'Showcase your creative work and services',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',
    pages: ['Home', 'Portfolio', 'About', 'Contact'],
    color: 'dark',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'CreativeAgency', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Portfolio', url: '/portfolio' }, { text: 'About', url: '/about' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'hero', props: { title: 'We Create Amazing Experiences', subtitle: 'Your vision, our expertise', buttonText: 'View Our Work', buttonLink: '#', bgColor: 'dark', textAlign: 'center' } },
        { type: 'gallery', props: { title: 'Recent Projects', images: [{ src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop', alt: 'Project 1' }, { src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop', alt: 'Project 2' }, { src: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop', alt: 'Project 3' }], columns: 3 } },
        { type: 'cta', props: { title: 'Let\'s Work Together', subtitle: '', buttonText: 'Start a Project', buttonLink: '#', bgColor: 'dark' } },
        { type: 'footer', props: { text: '© 2024 CreativeAgency', bgColor: 'dark', links: [] } }
      ],
      'Portfolio': [
        { type: 'navbar', props: { brandName: 'CreativeAgency', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Portfolio', url: '/portfolio' }] } },
        { type: 'text', props: { content: 'Our Portfolio', size: 'large', align: 'center' } },
        { type: 'gallery', props: { title: 'All Projects', images: [{ src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop', alt: 'P1' }, { src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop', alt: 'P2' }, { src: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop', alt: 'P3' }, { src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop', alt: 'P4' }], columns: 2 } },
        { type: 'footer', props: { text: '© 2024 CreativeAgency', bgColor: 'dark', links: [] } }
      ],
      'About': [
        { type: 'navbar', props: { brandName: 'CreativeAgency', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'About', url: '/about' }] } },
        { type: 'text', props: { content: 'About Us', size: 'large', align: 'center' } },
        { type: 'team', props: { title: 'Meet Our Team', members: [{ name: 'John Doe', role: 'Creative Director', image: 'https://i.pravatar.cc/300?img=12', bio: 'Visionary leader' }, { name: 'Jane Smith', role: 'Lead Designer', image: 'https://i.pravatar.cc/300?img=45', bio: 'Design expert' }] } },
        { type: 'footer', props: { text: '© 2024 CreativeAgency', bgColor: 'dark', links: [] } }
      ],
      'Contact': [
        { type: 'navbar', props: { brandName: 'CreativeAgency', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'contact_form', props: { title: 'Let\'s Talk', subtitle: 'Tell us about your project', buttonText: 'Send', fields: [{ type: 'text', label: 'Name', placeholder: 'Your name', required: true }, { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true }, { type: 'textarea', label: 'Project Details', placeholder: 'Describe your project', required: true }] } },
        { type: 'footer', props: { text: '© 2024 CreativeAgency', bgColor: 'dark', links: [] } }
      ]
    }
  },
  RESTAURANT: {
    name: 'Restaurant',
    category: 'Food & Beverage',
    description: 'Elegant template for restaurants and cafes',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    pages: ['Home', 'Menu', 'About', 'Contact'],
    color: 'warning',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Restaurant', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Menu', url: '/menu' }, { text: 'About', url: '/about' }, { text: 'Reservations', url: '/contact' }] } },
        { type: 'hero', props: { title: 'Fine Dining Experience', subtitle: 'Taste the perfection', buttonText: 'Book a Table', buttonLink: '#', bgColor: 'warning', textAlign: 'center' } },
        { type: 'features', props: { title: 'What Makes Us Special', items: [{ icon: '👨‍🍳', title: 'Expert Chefs', description: 'Award-winning culinary team' }, { icon: '🍷', title: 'Fine Wine', description: 'Curated wine selection' }, { icon: '🎵', title: 'Live Music', description: 'Every Friday & Saturday' }] } },
        { type: 'cta', props: { title: 'Make a Reservation', subtitle: '', buttonText: 'Book Now', buttonLink: '#', bgColor: 'warning' } },
        { type: 'footer', props: { text: '© 2024 Restaurant', bgColor: 'dark', links: [] } }
      ],
      'Menu': [
        { type: 'navbar', props: { brandName: 'Restaurant', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Menu', url: '/menu' }] } },
        { type: 'text', props: { content: 'Our Menu', size: 'large', align: 'center' } },
        { type: 'cards', props: { title: 'Signature Dishes', items: [{ icon: '🍝', title: 'Pasta', description: 'Fresh homemade pasta' }, { icon: '🥩', title: 'Steak', description: 'Premium cuts' }, { icon: '🍰', title: 'Desserts', description: 'Sweet perfection' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 Restaurant', bgColor: 'dark', links: [] } }
      ],
      'About': [
        { type: 'navbar', props: { brandName: 'Restaurant', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'About', url: '/about' }] } },
        { type: 'text', props: { content: 'Our Story', size: 'large', align: 'center' } },
        { type: 'text', props: { content: 'Founded in 2010, we bring authentic flavors to your table.', size: 'normal', align: 'center' } },
        { type: 'footer', props: { text: '© 2024 Restaurant', bgColor: 'dark', links: [] } }
      ],
      'Contact': [
        { type: 'navbar', props: { brandName: 'Restaurant', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'contact_form', props: { title: 'Reservations', subtitle: 'Book your table', buttonText: 'Submit', fields: [{ type: 'text', label: 'Name', placeholder: 'Your name', required: true }, { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true }, { type: 'text', label: 'Date & Time', placeholder: 'Preferred date/time', required: true }] } },
        { type: 'footer', props: { text: '© 2024 Restaurant', bgColor: 'dark', links: [] } }
      ]
    }
  },
  PORTFOLIO: {
    name: 'Personal Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work and skills',
    image: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=600&h=400&fit=crop',
    pages: ['Home', 'Work', 'About', 'Contact'],
    color: 'info',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Your Name', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Work', url: '/work' }, { text: 'About', url: '/about' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'hero', props: { title: 'Designer & Developer', subtitle: 'Creating beautiful digital experiences', buttonText: 'View My Work', buttonLink: '#', bgColor: 'info', textAlign: 'center' } },
        { type: 'cards', props: { title: 'What I Do', items: [{ icon: '🎨', title: 'Design', description: 'UI/UX Design' }, { icon: '💻', title: 'Development', description: 'Web & Mobile' }, { icon: '📱', title: 'Branding', description: 'Visual Identity' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 Your Name', bgColor: 'dark', links: [] } }
      ],
      'Work': [
        { type: 'navbar', props: { brandName: 'Your Name', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Work', url: '/work' }] } },
        { type: 'text', props: { content: 'My Work', size: 'large', align: 'center' } },
        { type: 'gallery', props: { title: 'Projects', images: [{ src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop', alt: 'W1' }, { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', alt: 'W2' }, { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', alt: 'W3' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 Your Name', bgColor: 'dark', links: [] } }
      ],
      'About': [
        { type: 'navbar', props: { brandName: 'Your Name', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'About', url: '/about' }] } },
        { type: 'text', props: { content: 'About Me', size: 'large', align: 'center' } },
        { type: 'text', props: { content: 'I\'m a passionate designer and developer with 5 years of experience.', size: 'normal', align: 'center' } },
        { type: 'footer', props: { text: '© 2024 Your Name', bgColor: 'dark', links: [] } }
      ],
      'Contact': [
        { type: 'navbar', props: { brandName: 'Your Name', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Contact', url: '/contact' }] } },
        { type: 'contact_form', props: { title: 'Get In Touch', subtitle: 'Let\'s work together', buttonText: 'Send', fields: [{ type: 'text', label: 'Name', placeholder: 'Your name', required: true }, { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true }, { type: 'textarea', label: 'Message', placeholder: 'Your message', required: true }] } },
        { type: 'footer', props: { text: '© 2024 Your Name', bgColor: 'dark', links: [] } }
      ]
    }
  },
  // Simplified templates for the rest (you can expand these later)
  ECOMMERCE: {
    name: 'E-Commerce Store',
    category: 'E-Commerce',
    description: 'Modern online store template',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    pages: ['Home', 'Products'],
    color: 'success',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Shop', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Products', url: '/products' }] } },
        { type: 'hero', props: { title: 'Shop the Latest', subtitle: 'Quality products at great prices', buttonText: 'Shop Now', buttonLink: '#', bgColor: 'success', textAlign: 'center' } },
        { type: 'cards', props: { title: 'Featured Products', items: [{ icon: '👕', title: 'Clothing', description: 'New arrivals' }, { icon: '👟', title: 'Shoes', description: 'Best sellers' }, { icon: '🎒', title: 'Accessories', description: 'Must-haves' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 Shop', bgColor: 'dark', links: [] } }
      ],
      'Products': [
        { type: 'navbar', props: { brandName: 'Shop', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Products', url: '/products' }] } },
        { type: 'text', props: { content: 'All Products', size: 'large', align: 'center' } },
        { type: 'gallery', props: { title: 'Browse Our Collection', images: [{ src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', alt: 'P1' }, { src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', alt: 'P2' }], columns: 2 } },
        { type: 'footer', props: { text: '© 2024 Shop', bgColor: 'dark', links: [] } }
      ]
    }
  },
  BLOG: {
    name: 'Blog & Magazine',
    category: 'Content',
    description: 'Clean blog layout for writers',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    pages: ['Home', 'Blog'],
    color: 'secondary',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Blog', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Blog', url: '/blog' }] } },
        { type: 'hero', props: { title: 'Stories & Ideas', subtitle: 'Read, learn, grow', buttonText: 'Start Reading', buttonLink: '#', bgColor: 'secondary', textAlign: 'center' } },
        { type: 'cards', props: { title: 'Latest Posts', items: [{ icon: '📝', title: 'Post 1', description: 'Intro to blogging' }, { icon: '📝', title: 'Post 2', description: 'Writing tips' }], columns: 2 } },
        { type: 'footer', props: { text: '© 2024 Blog', bgColor: 'dark', links: [] } }
      ],
      'Blog': [
        { type: 'navbar', props: { brandName: 'Blog', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }, { text: 'Blog', url: '/blog' }] } },
        { type: 'text', props: { content: 'All Articles', size: 'large', align: 'center' } },
        { type: 'text', props: { content: 'Your content here', size: 'normal', align: 'left' } },
        { type: 'footer', props: { text: '© 2024 Blog', bgColor: 'dark', links: [] } }
      ]
    }
  },
  CONSULTING: {
    name: 'Business Consulting',
    category: 'Business',
    description: 'Professional consulting services',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'primary',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Consulting', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Expert Business Advice', subtitle: 'Strategy & Growth', buttonText: 'Contact Us', buttonLink: '#', bgColor: 'primary', textAlign: 'center' } },
        { type: 'features', props: { title: 'Our Services', items: [{ icon: '📊', title: 'Strategy', description: 'Business planning' }, { icon: '💼', title: 'Operations', description: 'Efficiency optimization' }, { icon: '📈', title: 'Growth', description: 'Scaling solutions' }] } },
        { type: 'footer', props: { text: '© 2024 Consulting', bgColor: 'dark', links: [] } }
      ]
    }
  },
  FITNESS: {
    name: 'Fitness & Gym',
    category: 'Health & Fitness',
    description: 'Dynamic template for fitness centers',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'danger',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Gym', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Transform Your Body', subtitle: 'Start your fitness journey today', buttonText: 'Join Now', buttonLink: '#', bgColor: 'danger', textAlign: 'center' } },
        { type: 'features', props: { title: 'Why Join Us', items: [{ icon: '💪', title: 'Expert Trainers', description: 'Certified professionals' }, { icon: '🏋️', title: 'Modern Equipment', description: 'State-of-the-art' }, { icon: '⏰', title: '24/7 Access', description: 'Train anytime' }] } },
        { type: 'footer', props: { text: '© 2024 Gym', bgColor: 'dark', links: [] } }
      ]
    }
  },
  EDUCATION: {
    name: 'Online Courses',
    category: 'Education',
    description: 'E-learning and course platform',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'info',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'LearnHub', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Learn New Skills', subtitle: 'Expert-led online courses', buttonText: 'Browse Courses', buttonLink: '#', bgColor: 'info', textAlign: 'center' } },
        { type: 'cards', props: { title: 'Popular Courses', items: [{ icon: '💻', title: 'Web Dev', description: 'Build websites' }, { icon: '🎨', title: 'Design', description: 'UI/UX mastery' }], columns: 2 } },
        { type: 'footer', props: { text: '© 2024 LearnHub', bgColor: 'dark', links: [] } }
      ]
    }
  },
  REAL_ESTATE: {
    name: 'Real Estate',
    category: 'Real Estate',
    description: 'Property listings and showcases',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'success',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'RealEstate', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Find Your Dream Home', subtitle: 'Thousands of listings', buttonText: 'Search Properties', buttonLink: '#', bgColor: 'success', textAlign: 'center' } },
        { type: 'gallery', props: { title: 'Featured Properties', images: [{ src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop', alt: 'P1' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 RealEstate', bgColor: 'dark', links: [] } }
      ]
    }
  },
  PHOTOGRAPHY: {
    name: 'Photography Studio',
    category: 'Portfolio',
    description: 'Stunning photo gallery layouts',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'dark',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'PhotoStudio', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Capture The Moment', subtitle: 'Professional photography', buttonText: 'View Gallery', buttonLink: '#', bgColor: 'dark', textAlign: 'center' } },
        { type: 'gallery', props: { title: 'Portfolio', images: [{ src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop', alt: 'G1' }, { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', alt: 'G2' }], columns: 2 } },
        { type: 'footer', props: { text: '© 2024 PhotoStudio', bgColor: 'dark', links: [] } }
      ]
    }
  },
  EVENT: {
    name: 'Event Planning',
    category: 'Events',
    description: 'Perfect for event organizers',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'warning',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Events', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Unforgettable Events', subtitle: 'We plan, you celebrate', buttonText: 'Plan Your Event', buttonLink: '#', bgColor: 'warning', textAlign: 'center' } },
        { type: 'features', props: { title: 'What We Do', items: [{ icon: '🎉', title: 'Weddings', description: 'Perfect day' }, { icon: '🎂', title: 'Parties', description: 'Fun guaranteed' }, { icon: '🏢', title: 'Corporate', description: 'Professional events' }] } },
        { type: 'footer', props: { text: '© 2024 Events', bgColor: 'dark', links: [] } }
      ]
    }
  },
  MEDICAL: {
    name: 'Medical & Healthcare',
    category: 'Health & Fitness',
    description: 'Clean template for clinics and doctors',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'primary',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'HealthClinic', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Your Health Matters', subtitle: 'Expert medical care', buttonText: 'Book Appointment', buttonLink: '#', bgColor: 'primary', textAlign: 'center' } },
        { type: 'features', props: { title: 'Our Services', items: [{ icon: '🩺', title: 'General', description: 'Primary care' }, { icon: '💊', title: 'Pharmacy', description: 'Prescriptions' }, { icon: '🧪', title: 'Lab Tests', description: 'Diagnostics' }] } },
        { type: 'footer', props: { text: '© 2024 HealthClinic', bgColor: 'dark', links: [] } }
      ]
    }
  },
  NONPROFIT: {
    name: 'Non-Profit Organization',
    category: 'Non-Profit',
    description: 'Inspire donations and volunteers',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'success',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'NonProfit', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Make A Difference', subtitle: 'Together we can change lives', buttonText: 'Donate Now', buttonLink: '#', bgColor: 'success', textAlign: 'center' } },
        { type: 'features', props: { title: 'Our Impact', items: [{ icon: '❤️', title: 'Hope', description: 'Bringing hope' }, { icon: '🌍', title: 'Global', description: 'Worldwide reach' }, { icon: '👥', title: 'Community', description: 'Building together' }] } },
        { type: 'footer', props: { text: '© 2024 NonProfit', bgColor: 'dark', links: [] } }
      ]
    }
  },
  TRAVEL: {
    name: 'Travel & Tourism',
    category: 'Travel',
    description: 'Showcase destinations and packages',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'info',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'Travel', bgColor: 'light', textColor: 'dark', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Explore The World', subtitle: 'Your adventure awaits', buttonText: 'Book Trip', buttonLink: '#', bgColor: 'info', textAlign: 'center' } },
        { type: 'gallery', props: { title: 'Destinations', images: [{ src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', alt: 'D1' }], columns: 3 } },
        { type: 'footer', props: { text: '© 2024 Travel', bgColor: 'dark', links: [] } }
      ]
    }
  },
  MUSIC: {
    name: 'Music & Band',
    category: 'Entertainment',
    description: 'Perfect for musicians and bands',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
    pages: ['Home'],
    color: 'danger',
    pageLayouts: {
      'Home': [
        { type: 'navbar', props: { brandName: 'TheBand', bgColor: 'dark', textColor: 'light', links: [{ text: 'Home', url: '/' }] } },
        { type: 'hero', props: { title: 'Rock The Night', subtitle: 'Live music experience', buttonText: 'Listen Now', buttonLink: '#', bgColor: 'danger', textAlign: 'center' } },
        { type: 'video', props: { title: 'Latest Video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', aspectRatio: '16:9' } },
        { type: 'footer', props: { text: '© 2024 TheBand', bgColor: 'dark', links: [] } }
      ]
    }
  }
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const categories = ['All', ...new Set(Object.values(WEBSITE_TEMPLATES).map(t => t.category))]

  const filteredTemplates = selectedCategory === 'All'
    ? Object.entries(WEBSITE_TEMPLATES)
    : Object.entries(WEBSITE_TEMPLATES).filter(([_, template]) => template.category === selectedCategory)

  const handleUseTemplate = async (templateKey) => {
    setLoading(true)
    try {
      const template = WEBSITE_TEMPLATES[templateKey]
      
      // Create project
      const projectRes = await axios.post('/api/projects', {
        name: `${template.name} Project`
      })
      const projectId = projectRes.data.project.id

      // Delete default "Home" page
      const pagesRes = await axios.get(`/api/projects/${projectId}/pages`)
      if (pagesRes.data.pages.length > 0) {
        await axios.delete(`/api/projects/pages/${pagesRes.data.pages[0].id}`)
      }

      // Create pages from template
      for (const [pageName, components] of Object.entries(template.pageLayouts)) {
        const pageRes = await axios.post(`/api/projects/${projectId}/pages`, {
          title: pageName,
          slug: pageName.toLowerCase().replace(/\s+/g, '-'),
          is_home: pageName === 'Home' ? 1 : 0
        })

        // Add components with IDs
        const componentsWithIds = components.map((comp, index) => ({
          id: `${comp.type}-${Date.now()}-${index}`,
          ...comp
        }))

        // Save layout
        await axios.put(`/api/projects/pages/${pageRes.data.page.id}`, {
          layout_json: JSON.stringify(componentsWithIds)
        })
      }

      navigate(`/builder/${projectId}`)
    } catch (err) {
      console.error('Failed to create project:', err)
      alert(`Failed to create project: ${err.response?.data?.error || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = (templateKey) => {
    setSelectedTemplate(templateKey)
    setShowPreview(true)
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Choose Your Template</h1>
        <p className="lead text-muted">
          Start with a professionally designed template and customize it to match your brand
        </p>
      </div>

      <Nav variant="pills" className="justify-content-center mb-4 flex-wrap">
        {categories.map(cat => (
          <Nav.Link
            key={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className="mb-2"
          >
            {cat}
          </Nav.Link>
        ))}
      </Nav>

      <Row>
        {filteredTemplates.map(([key, template]) => (
          <Col md={4} lg={3} key={key} className="mb-4">
            <Card className="h-100 shadow-sm template-card">
              <div style={{ position: 'relative', paddingBottom: '66.67%', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={template.image} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="template-overlay">
                  <Button 
                    variant="light" 
                    className="me-2"
                    onClick={() => handlePreview(key)}
                  >
                    👁️ Preview
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => handleUseTemplate(key)}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Use Template'}
                  </Button>
                </div>
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="h6 mb-0">{template.name}</Card.Title>
                  <Badge bg={template.color}>{template.category}</Badge>
                </div>
                <Card.Text className="small text-muted mb-2">
                  {template.description}
                </Card.Text>
                <div className="d-flex gap-1 flex-wrap">
                  {template.pages.map((page, i) => (
                    <Badge key={i} bg="light" text="dark" className="small">
                      {page}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTemplate && WEBSITE_TEMPLATES[selectedTemplate].name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '60vh' }}>
          {selectedTemplate && (
            <div className="text-center">
              <img 
                src={WEBSITE_TEMPLATES[selectedTemplate].image} 
                alt={WEBSITE_TEMPLATES[selectedTemplate].name}
                className="img-fluid rounded mb-3"
              />
              <h5>{WEBSITE_TEMPLATES[selectedTemplate].description}</h5>
              <div className="d-flex gap-2 justify-content-center mt-3">
                {WEBSITE_TEMPLATES[selectedTemplate].pages.map((page, i) => (
                  <Badge key={i} bg="primary" className="p-2">
                    {page} Page
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowPreview(false)
              handleUseTemplate(selectedTemplate)
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Use This Template'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .template-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .template-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        
        .template-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .template-card:hover .template-overlay {
          opacity: 1;
        }
      `}</style>
    </Container>
  )
}