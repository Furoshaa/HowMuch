import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAlert } from '@/components/ui/alert-context'
import { useAuth } from '@/hooks/useAuth'

function Login() {
    const navigate = useNavigate()
    const { addAlert } = useAlert()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                // Login successful, store user data and show success alert
                console.log('🚀 Login component - calling useAuth.login with:', data.data);
                login(data.data)
                console.log('🚀 Login component - useAuth.login called, navigating to dashboard');
                
                addAlert({
                    type: 'success',
                    title: 'Welcome back!',
                    message: `Successfully logged in as ${data.data.firstname} ${data.data.lastname}`,
                    duration: 5000 // Persistent alert that stays until user closes it
                })
                
                // Navigate to dashboard
                navigate('/dashboard')
            } else {
                addAlert({
                    type: 'error',
                    title: 'Login Failed',
                    message: data.message || 'Invalid email or password',
                    duration: 5000
                })
            }
        } catch (error) {
            console.error('Login error:', error)
            addAlert({
                type: 'error',
                title: 'Network Error',
                message: 'Unable to connect to server. Please check your connection and try again.',
                duration: 6000
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Sign up here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login