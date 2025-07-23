"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { initializeAuth } from "@/store/slices/authThunks";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
