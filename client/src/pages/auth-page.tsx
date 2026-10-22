import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, UserPlus, Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    role: "user",
    confirmPassword: "",
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        // Handle password mismatch
        return;
      }
      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.fullName,
        role: formData.role,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl bg-white overflow-hidden">
        {/* Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center">
          <div className="text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-6">Welcome to SkillSync</h1>
            <p className="text-xl text-blue-100 mb-8">
              Your smart task and learning progress tracker designed for individuals and teams
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-200 rounded-full mr-3"></div>
                <span className="text-blue-100">Track your learning progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-200 rounded-full mr-3"></div>
                <span className="text-blue-100">Get AI-powered study tips</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-200 rounded-full mr-3"></div>
                <span className="text-blue-100">Collaborate with your team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
                {isLogin ? (
                  <GraduationCap className="h-8 w-8 text-white" />
                ) : (
                  <UserPlus className="h-8 w-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {isLogin 
                  ? "Sign in to track your learning progress" 
                  : "Start your learning journey with SkillSync"
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Enter your username"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="mt-1"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                  />
                </div>
                
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Confirm your password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {(loginMutation.isPending || registerMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
