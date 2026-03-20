import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as attendanceService from '../src/services/attendanceService';

// minimal component that logs out as soon as it mounts
function LogoutTester() {
  const { signOut } = useAuth();
  React.useEffect(() => {
    signOut();
  }, [signOut]);
  return null;
}

test('signOut should not call attendanceService.checkOut', async () => {
  const spy = jest.spyOn(attendanceService, 'checkOut');

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <AuthProvider children={<LogoutTester />} />
    );
  });

  expect(spy).not.toHaveBeenCalled();
});
