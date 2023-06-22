import * as React from 'react';

import { AppContext } from '.';
import { AppService } from '../services/AppService';

export const AppContextProvider = React.memo(({ children }) => {
  const [app] = React.useState(new AppService());

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
});
