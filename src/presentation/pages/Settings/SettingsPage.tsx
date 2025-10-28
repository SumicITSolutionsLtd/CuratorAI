import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  User,
  Bell,
  Lock,
  Palette,
  Shield,
  LogOut,
  Save,
  Camera,
  Sparkles,
  Shirt,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card } from '@/presentation/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { Switch } from '@/presentation/components/ui/switch'
import { Separator } from '@/presentation/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    newOutfits: true,
    socialActivity: true,
    promotions: false,
    weeklyDigest: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showWardrobe: true,
    showLikes: true,
    allowMessages: true,
  })

  const [styleFoundations, setStyleFoundations] = useState({
    primaryVibes: [] as string[],
    colors: [] as string[],
    fit: '',
    footwear: '',
  })

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:gap-2">
            <TabsTrigger
              value="profile"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <User className="h-4 w-4 lg:h-4 lg:w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <Bell className="h-4 w-4 lg:h-4 lg:w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Notify</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <Shield className="h-4 w-4 lg:h-4 lg:w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <Palette className="h-4 w-4 lg:h-4 lg:w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Style</span>
            </TabsTrigger>
            <TabsTrigger
              value="style-quiz"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <Sparkles className="h-4 w-4 lg:h-4 lg:w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Quiz</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-brand-charcoal">
                Profile Information
              </h2>

              {/* Avatar */}
              <div className="mb-6 flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-brand-crimson/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-brand-crimson hover:bg-brand-crimson/90"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-semibold text-brand-charcoal">Profile Photo</p>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size 5MB</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload New
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Chen" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@sarahchen" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    rows={3}
                    defaultValue="Fashion enthusiast | Style curator | Coffee lover ☕"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-brand-crimson hover:bg-brand-crimson/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-brand-charcoal">Change Password</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button className="mt-4 bg-brand-blue hover:bg-brand-blue/90">
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-brand-charcoal">
                Email Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Outfit Recommendations</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when we have new outfit suggestions for you
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newOutfits}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newOutfits: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Social Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Likes, comments, and follows on your posts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.socialActivity}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, socialActivity: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promotions & Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      News about features, sales, and special offers
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, promotions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Summary of your activity and trending outfits
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyDigest: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-brand-charcoal">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Wardrobe</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see your wardrobe items
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showWardrobe}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showWardrobe: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Liked Outfits</Label>
                    <p className="text-sm text-muted-foreground">
                      Display outfits you've liked on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showLikes}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showLikes: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Let other users send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowMessages: checked })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 text-lg font-semibold text-red-900">Delete Account</h2>
              <p className="mb-4 text-sm text-red-700">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-brand-charcoal">App Preferences</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                      <SelectItem value="cet">Central European (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-brand-charcoal">Style Preferences</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Style</Label>
                  <Select defaultValue="casual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="streetwear">Streetwear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ($-$$)</SelectItem>
                      <SelectItem value="medium">Medium ($$$)</SelectItem>
                      <SelectItem value="luxury">Luxury ($$$$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Style Quiz/Foundations Tab */}
          <TabsContent value="style-quiz" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Style Foundations */}
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="mb-1 text-xl font-bold text-brand-charcoal">Style Foundations</h2>
                  <p className="text-sm text-muted-foreground">Your baseline preference</p>
                </div>

                <div className="space-y-6">
                  {/* Primary Vibe */}
                  <div>
                    <Label className="mb-3 block font-semibold text-brand-charcoal">
                      Primary vibe
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Casual', 'Minimal', 'Street', 'Smart'].map((vibe) => {
                        const isSelected = styleFoundations.primaryVibes.includes(vibe)
                        return (
                          <Button
                            key={vibe}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`${
                              isSelected
                                ? 'bg-brand-charcoal text-white hover:bg-brand-charcoal/90'
                                : ''
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setStyleFoundations({
                                  ...styleFoundations,
                                  primaryVibes: styleFoundations.primaryVibes.filter(
                                    (v) => v !== vibe
                                  ),
                                })
                              } else {
                                setStyleFoundations({
                                  ...styleFoundations,
                                  primaryVibes: [...styleFoundations.primaryVibes, vibe],
                                })
                              }
                            }}
                          >
                            {vibe}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Colors You Love */}
                  <div>
                    <Label className="mb-3 block font-semibold text-brand-charcoal">
                      Colors you love
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Earth', color: 'bg-amber-700' },
                        { name: 'Black', color: 'bg-black' },
                        { name: 'Navy', color: 'bg-blue-900' },
                        { name: 'White', color: 'bg-white border' },
                        { name: 'Pastels', color: 'bg-pink-200' },
                      ].map((colorOption) => {
                        const isSelected = styleFoundations.colors.includes(colorOption.name)
                        return (
                          <Button
                            key={colorOption.name}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            className={`rounded-full ${
                              isSelected
                                ? 'bg-brand-charcoal text-white hover:bg-brand-charcoal/90'
                                : ''
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setStyleFoundations({
                                  ...styleFoundations,
                                  colors: styleFoundations.colors.filter(
                                    (c) => c !== colorOption.name
                                  ),
                                })
                              } else {
                                setStyleFoundations({
                                  ...styleFoundations,
                                  colors: [...styleFoundations.colors, colorOption.name],
                                })
                              }
                            }}
                          >
                            <div className={`mr-2 h-3 w-3 rounded-full ${colorOption.color}`} />
                            {colorOption.name}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Fit */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="mb-3 block font-semibold text-brand-charcoal">Fit</Label>
                      <div className="space-y-2">
                        {['Slim', 'Regular', 'Relaxed'].map((fitOption) => (
                          <Button
                            key={fitOption}
                            variant={styleFoundations.fit === fitOption ? 'default' : 'outline'}
                            size="sm"
                            className={`w-full ${
                              styleFoundations.fit === fitOption
                                ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                                : ''
                            }`}
                            onClick={() =>
                              setStyleFoundations({ ...styleFoundations, fit: fitOption })
                            }
                          >
                            {fitOption}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Footwear */}
                    <div>
                      <Label className="mb-3 block font-semibold text-brand-charcoal">
                        Footwear
                      </Label>
                      <div className="space-y-2">
                        {['Sneakers', 'Boots', 'Loafers'].map((footwearOption) => (
                          <Button
                            key={footwearOption}
                            variant={
                              styleFoundations.footwear === footwearOption ? 'default' : 'outline'
                            }
                            size="sm"
                            className={`w-full ${
                              styleFoundations.footwear === footwearOption
                                ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                                : ''
                            }`}
                            onClick={() =>
                              setStyleFoundations({
                                ...styleFoundations,
                                footwear: footwearOption,
                              })
                            }
                          >
                            {footwearOption}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    className="w-full bg-brand-charcoal text-white hover:bg-brand-charcoal/90"
                    size="lg"
                    onClick={() => {
                      console.log('Style foundations:', styleFoundations)
                      alert('Style preferences saved!')
                    }}
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Preferences
                  </Button>
                </div>
              </Card>

              {/* Snapshot Preview */}
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="mb-1 text-xl font-bold text-brand-charcoal">Snapshot Preview</h2>
                  <p className="text-sm text-muted-foreground">What your picks might look like</p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: item * 0.1 }}
                      className="aspect-square rounded-lg bg-gradient-to-br from-brand-beige to-brand-ivory p-4"
                    >
                      <div className="flex h-full flex-col items-center justify-center">
                        <Shirt className="mb-2 h-8 w-8 text-brand-charcoal/30" />
                        <p className="text-center text-xs text-muted-foreground">
                          {item % 2 === 0
                            ? 'Piece'
                            : item === 3
                              ? 'Look'
                              : item === 1
                                ? 'Piece'
                                : 'Look'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-brand-crimson/10 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-brand-crimson" />
                    <div>
                      <h4 className="mb-1 font-semibold text-brand-charcoal">
                        AI Personalization Active
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        We'll use these preferences to curate outfits that match your style.
                        Recommendations will improve as you interact with the app.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
