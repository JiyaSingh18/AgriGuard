import React from 'react';
import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-800 text-sage-100">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-sage-200" />
              <h2 className="text-xl font-bold text-white">AgriGuard</h2>
            </div>
            <p className="text-sage-300 mb-4">
              Your AI-powered companion for smarter, sustainable farming. Get expert advice, monitor crops, and optimize your agricultural operations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'Pricing', 'About Us', 'Contact'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sage-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Knowledge Base', 'Farming Tips', 'API Documentation', 'Help Center'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sage-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Subscribe</h3>
            <p className="text-sage-300 mb-4">
              Stay updated with the latest agricultural tips and news.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg bg-forest-700 border border-forest-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-forest-700 mt-8 pt-6 text-center text-sage-400">
          <p>© {new Date().getFullYear()} AgriGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;