import { Story } from '@/types'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Share, Eye, EyeSlash, Sparkle } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface StoryCardProps {
  story: Story
  isTopStory?: boolean
  onLike: (storyId: string) => void
  onShare: (storyId: string) => void
  onClick: (story: Story) => void
}

export function StoryCard({ story, isTopStory, onLike, onShare, onClick }: StoryCardProps) {
  const { currentUser } = useAuth()
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
    <Card
      className={cn(
        "p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer relative overflow-hidden",
        isTopStory && "border-2 border-accent shadow-md"
      )}
      onClick={() => onClick(story)}
    >
      {isTopStory && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-accent text-accent-foreground gap-1">
            <Sparkle size={14} weight="fill" />
            Top Story
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={story.author?.avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(getAuthorDisplay())}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-medium text-foreground">{getAuthorDisplay()}</span>
            <span className="text-muted-foreground text-sm">→</span>
            <Badge variant="secondary" className="gap-1">
              <span className="text-sm">{getRecipientDisplay()}</span>
            </Badge>
            {story.privacy !== 'public' && (
              <Badge variant="outline" className="gap-1">
                {story.privacy === 'private' ? <EyeSlash size={12} /> : <Eye size={12} />}
                <span className="text-xs">{story.privacy}</span>
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
          
          <p className="font-story text-foreground/90 leading-relaxed mb-4 line-clamp-3">
            {story.content}
          </p>

          {story.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {story.topics.map(topic => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 hover:text-primary",
                  isLiked && "text-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onLike(story.id)
                }}
              >
                <Heart size={18} weight={isLiked ? "fill" : "regular"} />
                <span>{story.likes.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:text-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(story.id)
                }}
              >
                <Share size={18} />
                <span>{story.shares}</span>
              </Button>
            </div>

            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
