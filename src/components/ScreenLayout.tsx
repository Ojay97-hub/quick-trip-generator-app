import React from 'react';
import { View, StatusBar, ScrollView, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface ScreenLayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'saved';
  showBottomNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  showBackButton?: boolean;
  headerRight?: React.ReactNode;
  onBack?: () => void;
  scrollable?: boolean;
  contentContainerStyle?: string; // Tailwind class
  showLogo?: boolean;
}

export const ScreenLayout = ({ 
  children, 
  activeTab = 'home', 
  showBottomNav = true,
  showHeader = true,
  headerTitle,
  headerSubtitle,
  showBackButton,
  headerRight,
  onBack,
  scrollable = false,
  contentContainerStyle = '',
  showLogo = false
}: ScreenLayoutProps) => {
  const insets = useSafeAreaInsets();

  const ContentWrapper = scrollable ? ScrollView : View;
  const wrapperProps = scrollable 
    ? { 
        contentContainerStyle: { paddingBottom: showBottomNav ? 100 : 20 },
        className: "flex-1 bg-light"
      }
    : { 
        className: "flex-1 bg-light relative" // relative for absolute positioning of bottom nav
      };

  return (
    <View className="flex-1 bg-secondary">
      <StatusBar barStyle="light-content" backgroundColor="#042D4C" />
      
      {showHeader && (
        <View style={{ paddingTop: insets.top }} className="bg-secondary">
           <Header 
             title={headerTitle} 
             subtitle={headerSubtitle}
             showBack={showBackButton} 
             rightElement={headerRight}
             onBack={onBack}
             showLogo={showLogo}
           />
        </View>
      )}

      <View className="flex-1 bg-light rounded-t-3xl overflow-hidden">
        <ContentWrapper {...wrapperProps}>
          <View className={`p-4 ${contentContainerStyle} ${!scrollable && showBottomNav ? 'pb-24' : ''}`}>
            {children}
          </View>
        </ContentWrapper>
      </View>

      {showBottomNav && <BottomNav activeTab={activeTab} />}
    </View>
  );
};

