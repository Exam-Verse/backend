import React from 'react';
import { Card } from '../components/ui';

export const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container-brutal">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">ExamVerse</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-700">
            Your one-stop platform for previous-year papers, verified solutions, AI explanations, and video tutorials.
          </p>
        </div>
        
        {/* Mission */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our <span className="text-primary">Mission</span></h2>
              <p className="text-lg text-gray-700 mb-4">
                We believe every student deserves easy access to quality study materials. ExamVerse was born out of the frustration of searching for previous-year papers across messy WhatsApp groups, outdated college websites, and unreliable sources.
              </p>
              <p className="text-lg text-gray-700">
                Our mission is to centralize, organize, and enhance the exam preparation experience with AI-powered solutions and community-verified content.
              </p>
            </div>
            <div className="bg-primary border-4 border-black shadow-brutal-xl p-8">
              <div className="bg-white border-3 border-black p-6">
                <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {[
                    '📄 Centralized paper repository',
                    '✅ Verified faculty uploads',
                    '🤖 AI-generated solutions',
                    '🎥 Video explanations',
                    '📊 Progress tracking',
                    '🔍 Advanced search & filters'
                  ].map((feature, index) => (
                    <li key={index} className="font-bold">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">
            How It <span className="text-primary">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Faculty Upload',
                desc: 'Verified faculty members upload previous-year question papers with optional solutions.',
                bg: 'bg-primary'
              },
              {
                step: '2',
                title: 'AI Processing',
                desc: 'Our system extracts questions using OCR and generates AI solutions using Gemini API.',
                bg: 'bg-secondary'
              },
              {
                step: '3',
                title: 'Student Access',
                desc: 'Students browse papers by college, subject, year, and get instant solutions with video tutorials.',
                bg: 'bg-accent'
              },
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <div className={`w-16 h-16 ${item.bg} border-3 border-black flex items-center justify-center text-3xl font-bold mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="bg-dark text-white -mx-4 px-4 py-16 border-y-4 border-black mb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Why <span className="text-secondary">Choose Us</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Faculty Verification',
                  desc: 'Only verified faculty can upload papers, ensuring authenticity and quality.'
                },
                {
                  title: 'AI-Powered Solutions',
                  desc: 'Get instant solutions to every question, powered by Google Gemini AI.'
                },
                {
                  title: 'Video Explanations',
                  desc: 'Watch curated YouTube videos for visual learning and better understanding.'
                },
                {
                  title: 'Organized Repository',
                  desc: 'Filter by college, course, subject, year, and exam type—no more searching.'
                },
                {
                  title: 'Free for Students',
                  desc: 'Access all papers and solutions completely free. No hidden costs.'
                },
                {
                  title: 'Community Driven',
                  desc: 'Report errors, upvote solutions, and help improve the platform together.'
                },
              ].map((item, index) => (
                <div key={index} className="bg-white text-dark border-3 border-white p-6">
                  <h3 className="text-lg font-bold mb-2 uppercase">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Built With <span className="text-primary">Modern Tech</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'FastAPI', icon: '⚡' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'Gemini AI', icon: '🤖' },
              { name: 'YouTube API', icon: '📺' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'OCR', icon: '📄' },
              { name: 'Cloudinary', icon: '☁️' },
            ].map((tech, index) => (
              <div key={index} className="card-brutal text-center p-6 hover:shadow-brutal-lg transition-all">
                <div className="text-4xl mb-2">{tech.icon}</div>
                <div className="font-bold">{tech.name}</div>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA */}
        <div className="bg-secondary border-4 border-black shadow-brutal-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">Join ExamVerse today and revolutionize your exam preparation!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/register" className="btn btn-primary">Sign Up Free</a>
            <a href="/papers" className="btn btn-outline">Browse Papers</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
