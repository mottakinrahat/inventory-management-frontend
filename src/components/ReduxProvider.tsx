"use client";

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../redux/store';
import { useGetUserMeQuery } from '../redux/api/apiSlice';
import { setCredentials } from '../redux/features/authSlice';
import { useEffect } from 'react';

function InitialAuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Use the hook but only skip if we don't have a token or already have a user
  const { data: userData, isSuccess } = useGetUserMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && userData && token) {
      const userObj = userData?.data || userData;
      dispatch(setCredentials({ user: userObj, accessToken: token }));
    }
  }, [isSuccess, userData, token, dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitialAuthWrapper>{children}</InitialAuthWrapper>
    </Provider>
  );
}
