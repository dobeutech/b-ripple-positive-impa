import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Story, User, AnonymousPost } from '@/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StoryCard } from '@/components/StoryCard'
import { CreateStoryDialog } from '@/components/CreateStoryDialog'
import { StoryDetailDialog } from '@/components/StoryDetailDialog'
import { AuthDialog } from '@/components/AuthDialog'
import { Heart, PencilSimple, Bell, User as UserIcon, Funnel, Sparkle, SignOut } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const TOPICS = [
  'All',
  'Kindness', 'Mentorship', 'Community Service', 'Healthcare', 'Education',
  'Environmental', 'Innovation', 'Friendship', 'Family', 'Courage', 'Compassion'
]

function AppContent() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const [stories, setStories] = useKV<Story[]>('stories', [])
  const [users] = useKV<User[]>('users', [])
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState<'main' | 'top' | 'my'>('main')
  const [selectedTopic, setSelectedTopic] = useState('All')

  const enrichedStories = useMemo(() => {
    return (stories || []).map(story => {
      const author = users?.find(u => u.id === story.authorId)
      const recipientUser = story.recipient.type === 'user' 
        ? users?.find(u => u.id === story.recipient.userId)
        : undefined
      
      return {
        ...story,
        author,
        recipient: {
          ...story.recipient,
          user: recipientUser
        }
      }
    })
  }, [stories, users])

  const filteredStories = useMemo(() => {
    let filtered = enrichedStories

    if (activeTab === 'main') {
      filtered = filtered.filter(s => s.privacy === 'public')
    } else if (activeTab === 'my' && currentUser) {
      filtered = filtered.filter(s =>
        s.recipient.type === 'user' && s.recipient.userId === currentUser.id
      )
    }

    if (selectedTopic !== 'All') {
      filtered = filtered.filter(s => s.topics.includes(selectedTopic))
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [enrichedStories, activeTab, selectedTopic, currentUser])

  const topStories = useMemo(() => {
    return [...filteredStories]
      .filter(s => s.privacy === 'public')
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5)
  }, [filteredStories])

  const displayStories = activeTab === 'top' ? topStories : filteredStories

  const handleCreateStory = async (storyData: AnonymousPost | any) => {
    let newStory: Story

    if ('authorId' in storyData) {
      newStory = {
        id: `story_${Date.now()}`,
        authorId: storyData.authorId,
        title: storyData.title,
        content: storyData.content,
        recipient: storyData.recipient,
        privacy: storyData.privacy,
        posterVisibility: storyData.posterVisibility,
        topics: storyData.topics,
        likes: [],
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } else {
      const anonymousUser: User = {
        id: `anon_${Date.now()}`,
        firstName: storyData.firstName,
        verificationStatus: 'unverified',
        interests: [],
        createdAt: new Date().toISOString(),
        isAnonymousUser: true
      }

      await setStories((currentStories) => currentStories || [])
      
      newStory = {
        id: `story_${Date.now()}`,
        authorId: anonymousUser.id,
        author: anonymousUser,
        title: storyData.title,
        content: storyData.content,
        recipient: storyData.recipient,
        privacy: 'public',
        posterVisibility: 'first-name',
        topics: storyData.topics,
        likes: [],
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    await setStories((currentStories) => [...(currentStories || []), newStory])
  }

  const handleLike = async (storyId: string) => {
    if (!currentUser) {
      toast.error('Please log in to like stories')
      setAuthDialogOpen(true)
      return
    }

    await setStories((currentStories) =>
      (currentStories || []).map(story => {
        if (story.id === storyId) {
          const likes = story.likes.includes(currentUser.id)
            ? story.likes.filter(id => id !== currentUser.id)
            : [...story.likes, currentUser.id]
          return { ...story, likes }
        }
        return story
      })
    )
  }

  const handleShare = async (storyId: string) => {
    await setStories((currentStories) =>
      (currentStories || []).map(story =>
        story.id === storyId
          ? { ...story, shares: story.shares + 1 }
          : story
      )
    )
    toast.success('Story shared!')
  }

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setCreateDialogOpen(true)
    } else {
      setCreateDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart size={24} weight="fill" className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ripple
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateClick}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <PencilSimple size={18} weight="bold" />
                <span className="hidden sm:inline">Share Story</span>
              </Button>

              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Bell size={20} />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage src={currentUser.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {currentUser.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="hidden sm:flex"
                    >
                      <SignOut size={20} />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAuthDialogOpen(true)}
                  className="gap-2"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Celebrate Positive Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share stories of how people make the world better, one act of kindness at a time
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="main">Main Feed</TabsTrigger>
                <TabsTrigger value="top" className="gap-1">
                  <Sparkle size={14} weight="fill" />
                  Top Stories
                </TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="my">My Stories</TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Funnel size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">Filter by topic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => (
                  <Badge
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <TabsContent value="main" className="space-y-6 mt-0">
              {displayStories.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Heart size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No stories yet</h3>
                  <p className="text-muted-foreground">Be the first to share a positive story!</p>
                  <Button onClick={handleCreateClick} className="bg-primary hover:bg-primary/90">
                    Share a Story
                  </Button>
                </div>
              ) : (
                displayStories.map(story => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onLike={handleLike}
                    onShare={handleShare}
                    onClick={setSelectedStory}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="top" className="space-y-6 mt-0">
              {topStories.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Sparkle size={40} weight="fill" className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No top stories yet</h3>
                  <p className="text-muted-foreground">Stories with the most likes will appear here</p>
                </div>
              ) : (
                topStories.map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isTopStory={index < 3}
                    onLike={handleLike}
                    onShare={handleShare}
                    onClick={setSelectedStory}
                  />
                ))
              )}
            </TabsContent>

            {isAuthenticated && (
              <TabsContent value="my" className="space-y-6 mt-0">
                {displayStories.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <UserIcon size={40} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">No stories about you yet</h3>
                    <p className="text-muted-foreground">When someone writes about you, stories will appear here</p>
                  </div>
                ) : (
                  displayStories.map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onLike={handleLike}
                      onShare={handleShare}
                      onClick={setSelectedStory}
                    />
                  ))
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      <CreateStoryDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateStory}
      />

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />

      <StoryDetailDialog
        story={selectedStory}
        open={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        onLike={handleLike}
        onShare={handleShare}
      />

      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
