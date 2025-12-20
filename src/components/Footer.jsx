import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-8 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        {/* LOGO FOOTER MERAH */}
        <Link to="/" className="text-xl font-bold text-red-600 dark:text-red-500 mb-4 inline-block hover:text-red-700 dark:hover:text-red-400 transition-colors">
            ZenNovel
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          © {new Date().getFullYear()} ZenNovel. Read your favorite novels.
        </p>
        
        <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
           <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
           <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;