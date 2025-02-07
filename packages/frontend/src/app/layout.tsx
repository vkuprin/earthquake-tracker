import './global.css';
import ApolloWrapper from '@/app/ApolloWrapper';
import React, { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => (
  <html lang="en">
    <body>
      <ApolloWrapper>{children}</ApolloWrapper>
    </body>
  </html>
);
