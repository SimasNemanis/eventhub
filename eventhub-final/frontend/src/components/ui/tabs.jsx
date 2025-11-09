import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export const Tabs = ({ defaultValue, value, onValueChange, children, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = '' }) => {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  return (
    <button
      onClick={() => setSelectedTab(value)}
      className={`px-6 py-3 font-medium transition-all ${
        isActive
          ? 'border-b-2 border-blue-600 text-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = '' }) => {
  const { selectedTab } = useContext(TabsContext);

  if (selectedTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};
