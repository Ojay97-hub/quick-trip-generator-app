import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
  innerColor?: string;
}

export const Logo = ({ size = 40, color = '#FF6B35', innerColor = '#042D4C' }: LogoProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer Ring */}
      <Circle cx="50" cy="50" r="45" stroke={color} strokeWidth="8" />
      
      {/* Abstract Paths - mimicking the crossroads/world look */}
      {/* Top Left Path */}
      <Path 
        d="M25 50 C25 35 35 25 50 25" 
        stroke={innerColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Top Right Path */}
      <Path 
        d="M50 25 C65 25 75 35 75 50" 
        stroke={innerColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Bottom Left Path */}
      <Path 
        d="M25 50 C25 65 35 75 50 75" 
        stroke={innerColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Bottom Right Path */}
      <Path 
        d="M75 50 C75 65 65 75 50 75" 
        stroke={innerColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Central Connection */}
      <Circle cx="50" cy="50" r="8" fill={innerColor} />
    </Svg>
  );
};



