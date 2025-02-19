import { FaArrowRight, FaCheck } from 'react-icons/fa';
import FeatureCard from '../components/FeatureCard';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      title: "AI Powered",
      description: "Generate code and allow our AI to save your code clips for you."
    },
    {
      title: "Universal Clipboard",
      description: "Access your code from any device, anywhere."
    },
    {
      title: "Time-Saving",
      description: "It really is just one click - or should I say clip!"
    },
    {
      title: "Organization",
      description: "No more searching through old folders for that perfect solution."
    },
    {
      title: "Learning and Growth",
      description: "Smart learning features such as time and space complexity, notes, and descriptive titles."
    },
    {
      title: "Simplicity",
      description: "Experience a seamless and intuitive interface that makes saving and organizing your code effortless."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        
        {/* Subtle mesh pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(120deg, #f0f4ff 0%, #f5f3ff 100%)`,
          backgroundSize: '100% 100%',
          opacity: 0.8,
        }}></div>
        
        {/* Light decorative lines */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(176, 196, 222, 0.1) 95%),
                             linear-gradient(0deg, transparent 95%, rgba(176, 196, 222, 0.1) 95%)`,
            backgroundSize: '20px 20px'
          }}>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center py-20 px-4">
            <div className="text-center max-w-5xl mx-auto">
              <div className="mb-20">
                <h1 className="text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 animate-gradient">
                  Code. Clip. Save.
                </h1>
                <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Instantly save and organize your code with a single "clip". Paste or generate code with AI, 
                  then access it anytime in your personal clipboard.
                </p>
              </div>
              <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">
                No more lost code—just fast, effortless coding with all your work neatly stored.
              </p>
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => window.location.href = '/signup'} 
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => window.location.href = '/login'} 
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Log In
                </button>
              </div>
            </div>
          </section>

          {/* Why Use Section */}
          <section className="min-h-screen py-32 px-4">
            <div className="container mx-auto">
              <h2 className="text-5xl font-bold text-center mb-8">Why Use ClipCodeAI</h2>
              <p className="text-center text-gray-600 mb-20 max-w-3xl mx-auto text-xl leading-relaxed">
                Have you ever had code that you didn't want to push to a repository? Solutions to problems 
                you've tackled that you want to revisit later? Queries you need to store in a quickly 
                accessible and organized way? Welcome to the solution to all those problems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="container mx-auto px-4 py-32">
            <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>
            <div className="flex flex-row justify-between items-start max-w-7xl mx-auto gap-20">
              <div className="flex flex-col items-center flex-1 relative px-16">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">1</div>
                <div className="mt-6 min-h-[80px]">
                  <p className="text-center text-lg">Either copy your code or ask AI to generate your algorithm</p>
                </div>
                <div className="absolute right-0 top-20 -translate-y-1/2 translate-x-1/2">
                  <FaArrowRight className="text-3xl text-blue-600" />
                </div>
              </div>
              <div className="flex flex-col items-center flex-1 relative px-16">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">2</div>
                <div className="mt-6 min-h-[80px]">
                  <p className="text-center text-lg">Press clip</p>
                </div>
                <div className="absolute right-0 top-20 -translate-y-1/2 translate-x-1/2">
                  <FaArrowRight className="text-3xl text-blue-600" />
                </div>
              </div>
              <div className="flex flex-col items-center flex-1 relative px-16">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">3</div>
                <div className="mt-6 min-h-[80px]">
                  <p className="text-center text-lg">Let our AI generate you the details or manually enter it yourself</p>
                </div>
              </div>
            </div>
            <div className="mt-10 text-center mb-32">
              <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                Now you can visit your clipboard to see all your saved code!
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Landing; 