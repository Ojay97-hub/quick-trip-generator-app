import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button = ({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon,
  className,
  disabled,
  ...props 
}: ButtonProps) => {
  
  const getBaseStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary border-primary';
      case 'secondary':
        return 'bg-secondary border-secondary';
      case 'outline':
        return 'bg-transparent border-secondary border-2';
      case 'ghost':
        return 'bg-transparent border-transparent';
      default:
        return 'bg-secondary border-secondary';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'text-white';
      case 'outline':
        return 'text-secondary';
      case 'ghost':
        return 'text-secondary';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-3 px-6';
      case 'lg':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <StyledTouchableOpacity 
      className={`rounded-xl flex-row justify-center items-center border ${getBaseStyles()} ${getSizeStyles()} ${disabled || loading ? 'opacity-70' : ''} ${className || ''}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#042D4C' : '#FFF'} />
      ) : (
        <>
          {icon}
          <Text className={`font-bodyBold text-center ${getTextStyles()} ${getTextSizeStyles()} ${icon ? 'ml-2' : ''}`}>
            {title}
          </Text>
        </>
      )}
    </StyledTouchableOpacity>
  );
};

