import React from "react";
import Script from "next/script";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    
      
        <div className="w-full">
          <div className="z-0">{children}</div>
        </div>
    </>
  );
};

export default Layout;