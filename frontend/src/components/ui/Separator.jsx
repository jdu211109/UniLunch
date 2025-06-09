import React from 'react';

const Separator = React.forwardRef(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={`border-t ${className}`}
    {...props}
  />
));

export { Separator };