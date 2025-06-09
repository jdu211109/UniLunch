import React from 'react';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 ${className}`}
    {...props}
  />
));

export { Textarea };