import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white border-t-4 border-black mt-20">
      <div className="container-brutal py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary border-3 border-white flex items-center justify-center font-bold text-xl">
                E
              </div>
              <span className="text-xl font-bold uppercase">
                Exam<span className="text-primary">Verse</span>
              </span>
            </div>
            <p className="text-sm">
              Previous-year papers. Verified solutions. AI + video explanations. One platform.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/papers" className="hover:text-primary transition-colors">Browse Papers</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          {/* For Faculty */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-lg">For Faculty</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faculty/register" className="hover:text-primary transition-colors">Faculty Sign Up</Link></li>
              <li><Link to="/faculty/upload" className="hover:text-primary transition-colors">Upload Papers</Link></li>
              <li><Link to="/faculty/guidelines" className="hover:text-primary transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold uppercase mb-4 text-lg">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Report Issue</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t-3 border-white mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2025 ExamVerse. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors font-bold">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors font-bold">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors font-bold">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
