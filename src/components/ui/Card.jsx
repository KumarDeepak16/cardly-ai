
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
  >
    {children}
  </div>
);
  
  
  

export default Card