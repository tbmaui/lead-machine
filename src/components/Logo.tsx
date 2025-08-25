import logoLong from '@/assets/logo-long-new.png';

const Logo = () => {
  return (
    <div className="flex justify-center py-8">
      <img 
        src={logoLong} 
        alt="Complete Controller Logo" 
        className="h-36 w-auto"
      />
    </div>
  );
};

export default Logo;