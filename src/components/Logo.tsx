import logoImage from '@/assets/complete-controller-logo.png';

const Logo = () => {
  return (
    <img
      src={logoImage}
      alt="Complete Controller - America's Bookkeeping Experts"
      className="h-12 w-auto"
      onError={(e) => {
        // Fallback to public directory version
        (e.target as HTMLImageElement).src = '/complete-controller-logo-new.png';
      }}
    />
  );
};

export default Logo;