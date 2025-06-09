import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Badge, Separator, Switch } from '../ui';

export default function AccountSettings({ user }) {
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [theme, setTheme] = React.useState('light');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email || ''} readOnly />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <Label>Dark Mode</Label>
          <Switch 
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}