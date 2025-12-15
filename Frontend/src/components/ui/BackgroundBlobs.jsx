const BackgroundBlobs = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-gradient-start/40 blur-3xl animate-float" />
      <div className="absolute right-[-60px] top-20 h-80 w-80 rounded-full bg-primary-gradient-end/35 blur-3xl animate-float-delayed" />
      <div className="absolute left-10 bottom-[-80px] h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-float" />
    </div>
  );
};

export default BackgroundBlobs;

