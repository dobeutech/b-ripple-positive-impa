import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PrivacyLevel, PosterVisibility, Recipient, AnonymousPost } from '@/types'
import { Eye, EyeSlash, User, X } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface CreateStoryDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (story: AnonymousPost | any) => void
}

const TOPICS = [
  'Kindness', 'Mentorship', 'Community Service', 'Healthcare', 'Education',
  'Environmental', 'Innovation', 'Friendship', 'Family', 'Courage', 'Compassion'
]

export function CreateStoryDialog({ open, onClose, onSubmit }: CreateStoryDialogProps) {
  const { currentUser } = useAuth()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recipientType, setRecipientType] = useState<'user' | 'anonymous'>('anonymous')
  const [recipientName, setRecipientName] = useState('')
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public')
  const [posterVisibility, setPosterVisibility] = useState<PosterVisibility>('full-profile')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [anonymousFirstName, setAnonymousFirstName] = useState('')

  const handleReset = () => {
    setStep(1)
    setTitle('')
    setContent('')
    setRecipientType('anonymous')
    setRecipientName('')
    setPrivacy('public')
    setPosterVisibility('full-profile')
    setSelectedTopics([])
    setAnonymousFirstName('')
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !recipientName.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!currentUser && !anonymousFirstName.trim()) {
      toast.error('Please enter your first name')
      return
    }

    const recipient: Recipient = {
      type: recipientType,
      anonymousName: recipientType === 'anonymous' ? recipientName : undefined,
      userId: recipientType === 'user' ? recipientName : undefined
    }

    if (currentUser) {
      onSubmit({
        title,
        content,
        recipient,
        privacy,
        posterVisibility,
        topics: selectedTopics,
        authorId: currentUser.id
      })
    } else {
      const anonymousPost: AnonymousPost = {
        firstName: anonymousFirstName,
        recipient,
        content,
        title,
        topics: selectedTopics
      }
      onSubmit(anonymousPost)
    }

    toast.success('Story shared successfully!')
    handleClose()
  }

  const getPrivacyDescription = (level: PrivacyLevel) => {
    switch (level) {
      case 'public':
        return 'Anyone can see this story'
      case 'private':
        return 'Only you can see this story'
      case 'recipient-only':
        return 'Only you and the recipient can see'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share a Positive Story</DialogTitle>
          <DialogDescription>
            Tell us about someone who made a positive impact
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!currentUser && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <Label htmlFor="anonymous-name">Your First Name *</Label>
              <Input
                id="anonymous-name"
                placeholder="Enter your first name"
                value={anonymousFirstName}
                onChange={(e) => setAnonymousFirstName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Posting anonymously. Sign up for more features!
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient-type">Who is this story about? *</Label>
            <Select value={recipientType} onValueChange={(v) => setRecipientType(v as 'user' | 'anonymous')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anonymous">Someone not on Ripple yet</SelectItem>
                <SelectItem value="user">A Ripple user</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-name">
              {recipientType === 'anonymous' ? "Recipient's Name *" : 'Username *'}
            </Label>
            <Input
              id="recipient-name"
              placeholder={recipientType === 'anonymous' ? "e.g., Sarah Johnson" : "@username"}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Story Title *</Label>
            <Input
              id="title"
              placeholder="Give your story a meaningful title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              placeholder="Describe the positive impact this person had. What did they do? How did it affect you or others?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={2000}
              className="font-story text-base resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{content.length}/2000</p>
          </div>

          <div className="space-y-2">
            <Label>Topics (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(topic => (
                <Badge
                  key={topic}
                  variant={selectedTopics.includes(topic) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                  {selectedTopics.includes(topic) && <X size={14} className="ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {currentUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select value={privacy} onValueChange={(v) => setPrivacy(v as PrivacyLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="recipient-only">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Recipient Only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeSlash size={16} />
                        <span>Private</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {getPrivacyDescription(privacy)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Show my name as</Label>
                <Select value={posterVisibility} onValueChange={(v) => setPosterVisibility(v as PosterVisibility)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-profile">Full Profile</SelectItem>
                    <SelectItem value="first-name">First Name Only</SelectItem>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Share Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
