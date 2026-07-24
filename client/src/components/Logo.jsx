const Logo = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect width="38" height="38" rx="11" className="fill-fittree-forest" />
      {/* Two-leaf sprout mark — a custom glyph, not a stock icon */}
      <path
        d="M19 27.5V17.8"
        stroke="#FBF6EC"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M19 19.5C19 14.5 15.2 10.8 10.5 10C10.1 15 13.3 19.2 19 19.5Z"
        fill="#FBF6EC"
      />
      <path
        d="M19 17C19 12.6 22.3 9.3 26.5 8.5C26.9 12.9 24.1 16.7 19 17Z"
        className="fill-fittree-accent"
      />
    </svg>
    <span className="flex flex-col leading-none">
      <span className="text-[24px] md:text-[27px] font-extrabold tracking-tight">
        <span className="text-fittree-dark">Fit</span>
        <span className="text-fittree-primary">Tree</span>
      </span>
      <span className="text-[9.5px] md:text-[10px] font-bold tracking-[0.32em] text-fittree-text-light mt-0.5">
        ORGANICS
      </span>
    </span>
  </div>
);

export default Logo;
