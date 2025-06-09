import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={`w-11 h-6 rounded-full relative ${className}`}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform" />
  </SwitchPrimitive.Root>
));

export { Switch };