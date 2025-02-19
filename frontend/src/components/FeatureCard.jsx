import { FaRobot, FaGlobeAmericas, FaClock, FaFolderOpen, FaBrain, FaPiggyBank, FaRegSmile } from 'react-icons/fa';

const iconMap = {
  "AI Powered": FaRobot,
  "Universal Clipboard": FaGlobeAmericas,
  "Time-Saving": FaClock,
  "Organization": FaFolderOpen,
  "Learning and Growth": FaBrain,
  "Affordable": FaPiggyBank,
  "Simplicity": FaRegSmile,
};

const FeatureCard = ({ title, description }) => {
  const Icon = iconMap[title];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg 
      hover:shadow-2xl hover:scale-105 transition-all duration-300 
      transform hover:-translate-y-2 hover:bg-white/95 
      border border-transparent hover:border-blue-100">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="text-4xl text-blue-600 mr-4" />}
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
};

export default FeatureCard; 