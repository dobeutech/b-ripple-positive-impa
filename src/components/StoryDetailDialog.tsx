import { Story } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Share, Eye, EyeSlash, Sparkle, ShieldCheck } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Separator } from '@/components/ui/separator'

interface StoryDetailDialogProps {
  story: Story | null
  open: boolean
  onClose: () => void
  onLike: (storyId: string) => void
  onShare: (storyId: string) => void
}

export function StoryDetailDialog({ story, open, onClose, onLike, onShare }: StoryDetailDialogProps) {
  const { currentUser } = useAuth()
  
  if (!story) return null

  const isLiked = currentUser ? story.likes.includes(currentUser.id) : false

  const getAuthorDisplay = () => {
    if (!story.author) return 'Anonymous'
    
    switch (story.posterVisibility) {
      case 'anonymous':
        return 'Anonymous'
      case 'first-name':
        return story.author.firstName
      case 'full-profile':
        return story.author.username || `${story.author.firstName} ${story.author.lastName || ''}`
    }
  }

  const getRecipientDisplay = () => {
    if (story.recipient.type === 'anonymous') {
      return story.recipient.anonymousName
    }
    return story.recipient.user?.username || story.recipient.user?.firstName || 'Unknown'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={story.author?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(getAuthorDisplay())}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-lg">{getAuthorDisplay()}</span>
                {story.author?.verificationStatus === 'id-verified' && (
                  <ShieldCheck size={20} weight="fill" className="text-secondary" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">wrote about</span>
                <Badge variant="secondary" className="gap-1">
                  <span>{getRecipientDisplay()}</span>
                </Badge>
                {story.privacy !== 'public' && (
                  <Badge variant="outline" className="gap-1">
                    {story.privacy === 'private' ? <EyeSlash size={12} /> : <Eye size={12} />}
                    <span className="text-xs">{story.privacy}</span>
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          <DialogTitle className="text-2xl font-semibold leading-tight">
            {story.title}
          </DialogTitle>

          <div className="font-story text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {story.content}
          </div>

          {story.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {story.topics.map(topic => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "gap-2 hover:text-primary transition-all",
                isLiked && "text-primary"
              )}
              onClick={() => onLike(story.id)}
            >
              <Heart size={24} weight={isLiked ? "fill" : "regular"} />
              <span className="text-base">{story.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="gap-2 hover:text-secondary transition-all"
              onClick={() => onShare(story.id)}
            >
              <Share size={24} />
              <span className="text-base">{story.shares}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
