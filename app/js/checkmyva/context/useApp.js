import React from 'react';

import { AppContext } from '.';

export function useApp() {
  return React.useContext(AppContext);
}
