const LightPillarBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-y-0 left-[15%] w-[160px] bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0 blur-2xl opacity-70" />
      <div className="absolute inset-y-0 right-[12%] w-[200px] bg-gradient-to-b from-secondary/0 via-secondary/20 to-secondary/0 blur-3xl opacity-60" />
      <div className="absolute top-[20%] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
    </div>
  );
};

export default LightPillarBackground;
