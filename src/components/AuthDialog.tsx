import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { EnvelopeSimple, Password, User, ShieldCheck } from '@phosphor-icons/react'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { login, signup } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupFirstName, setSignupFirstName] = useState('')
  const [signupLastName, setSignupLastName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')

  const handleReset = () => {
    setLoginEmail('')
    setLoginPassword('')
    setSignupFirstName('')
    setSignupLastName('')
    setSignupUsername('')
    setSignupEmail('')
    setSignupPassword('')
    setSignupConfirmPassword('')
  }

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields')
      return
    }

    const success = await login(loginEmail, loginPassword)
    if (success) {
      toast.success('Welcome back!')
      handleReset()
      onClose()
    } else {
      toast.error('Invalid email or password')
    }
  }

  const handleSignup = async () => {
    if (!signupFirstName || !signupEmail || !signupPassword) {
      toast.error('Please fill in all required fields')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    const success = await signup({
      firstName: signupFirstName,
      lastName: signupLastName,
      username: signupUsername,
      email: signupEmail,
      password: signupPassword
    })

    if (success) {
      toast.success('Account created successfully!')
      handleReset()
      onClose()
    } else {
      toast.error('Email already exists')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Ripple</DialogTitle>
          <DialogDescription>
            Join our community of positive storytellers
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Password className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
              Login
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-firstname">First Name *</Label>
                <Input
                  id="signup-firstname"
                  placeholder="John"
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-lastname">Last Name</Label>
                <Input
                  id="signup-lastname"
                  placeholder="Doe"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="signup-username"
                  placeholder="@johndoe"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email *</Label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password *</Label>
              <div className="relative">
                <Password className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm">Confirm Password *</Label>
              <div className="relative">
                <Password className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
              <ShieldCheck size={20} className="text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your email will be verified. You can add ID verification later for a verified badge.
              </p>
            </div>

            <Button onClick={handleSignup} className="w-full bg-primary hover:bg-primary/90">
              Create Account
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
