// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../navigation/useToast.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label
} from "../ui";

export default function AuthPage() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const signUpMutation = useMutation({
    mutationFn: async (data) => {
      // Здесь должен быть ваш API запрос
      return Promise.resolve(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have successfully signed up",
      });
      auth.signIn({ email });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      signUpMutation.mutate({ email });
    } else {
      auth.signIn({ email });
    }
  };

  if (auth.status === "authenticated") {
    return <Navigate to="/menu" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? "Enter your email to create an account"
              : "Enter your email to sign in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={signUpMutation.isPending}
            onClick={handleSubmit}
          >
            {signUpMutation.isPending ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}