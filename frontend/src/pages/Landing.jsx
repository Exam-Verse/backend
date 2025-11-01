import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container-brutal py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary text-white px-4 py-2 border-3 border-black mb-6 font-bold uppercase text-sm rotate-slight">
              🎓 For Students & Faculty
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Previous-year papers. <span className="text-primary">Verified solutions.</span> AI + video explanations.
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              One platform to access, solve, and master previous-year question papers with AI-powered solutions and video tutorials.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free →
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="border-3 border-black bg-secondary p-4">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm font-bold uppercase">Papers</div>
              </div>
              <div className="border-3 border-black bg-accent p-4">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm font-bold uppercase">Colleges</div>
              </div>
              <div className="border-3 border-black bg-success p-4">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm font-bold uppercase">Students</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-primary border-4 border-black shadow-brutal-xl p-8 rotate-2">
              <div className="bg-white border-3 border-black p-6 -rotate-2">
                <div className="space-y-4">
                  <div className="h-4 bg-dark w-3/4"></div>
                  <div className="h-4 bg-dark w-full"></div>
                  <div className="h-4 bg-dark w-2/3"></div>
                  <div className="h-20 bg-gray border-2 border-black mt-6"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-secondary border-2 border-black flex-1"></div>
                    <div className="h-8 bg-accent border-2 border-black flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Problem Section */}
      <section className="bg-dark text-white py-20 border-y-4 border-black">
        <div className="container-brutal">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            What Problem We <span className="text-secondary">Solve</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📄',
                title: 'No Access to Papers',
                desc: 'College websites are unorganized, outdated, or useless.'
              },
              {
                icon: '❌',
                title: 'Unreliable Solutions',
                desc: 'Random internet answers are inconsistent and confusing.'
              },
              {
                icon: '🎯',
                title: 'No Structured Practice',
                desc: 'Competitive exam aspirants waste time searching PDFs.'
              },
              {
                icon: '🤝',
                title: 'Scattered System',
                desc: 'Paper sharing via WhatsApp, seniors, Google Drive—messy.'
              },
            ].map((problem, index) => (
              <div key={index} className="bg-white text-dark border-3 border-white p-6 hover:shadow-brutal-lg transition-all">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold mb-2 uppercase">{problem.title}</h3>
                <p className="text-sm">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container-brutal py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          How <span className="text-primary">ExamVerse</span> Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Faculty Upload Papers',
              desc: 'Verified faculty members upload previous-year question papers with optional solutions.',
              color: 'bg-primary'
            },
            {
              step: '02',
              title: 'AI Generates Solutions',
              desc: 'Our AI (Gemini) automatically generates accurate, exam-centric solutions for every question.',
              color: 'bg-secondary'
            },
            {
              step: '03',
              title: 'Video Explanations',
              desc: 'Each question has curated YouTube video solutions for visual learning.',
              color: 'bg-accent'
            },
            {
              step: '04',
              title: 'Organized by College',
              desc: 'Browse papers filtered by your college, course, subject, and year.',
              color: 'bg-success'
            },
            {
              step: '05',
              title: 'Track Progress',
              desc: 'Save questions, bookmark papers, and monitor your learning analytics.',
              color: 'bg-danger'
            },
            {
              step: '06',
              title: 'Report Issues',
              desc: 'Found a wrong answer? Report it and help improve the platform.',
              color: 'bg-dark text-white'
            },
          ].map((feature, index) => (
            <Card key={index} hover className="relative overflow-hidden">
              <div className={`absolute -top-4 -right-4 w-20 h-20 ${feature.color} border-3 border-black flex items-center justify-center font-bold text-2xl rotate-12`}>
                {feature.step}
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase pr-12">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-secondary py-20 border-y-4 border-black">
        <div className="container-brutal text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students already using ExamVerse to prepare smarter, not harder.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Sign Up as Student
              </Button>
            </Link>
            <Link to="/faculty/register">
              <Button variant="outline" size="lg">
                Register as Faculty
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="container-brutal py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          What <span className="text-primary">Students</span> Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Priya Sharma',
              role: 'CS Student',
              text: 'ExamVerse saved me hours of searching for previous papers. The AI solutions are surprisingly accurate!'
            },
            {
              name: 'Rahul Verma',
              role: 'Engineering Student',
              text: 'Video explanations are game-changers. Finally found a platform that actually helps!'
            },
            {
              name: 'Anjali Singh',
              role: 'Medical Student',
              text: 'Love how organized everything is. No more messy WhatsApp groups!'
            },
          ].map((testimonial, index) => (
            <Card key={index} className="bg-gray">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary border-3 border-black flex items-center justify-center font-bold text-xl text-white mr-3">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 uppercase">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
