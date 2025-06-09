import React from 'react';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none ${className}`}
    {...props}
  />
));

export { Label };