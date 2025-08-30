import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Camera,
  Edit3,
  Save,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileCardProps {
  onClose: () => void;
}

export function ProfileCard({ onClose }: ProfileCardProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    title: "Lead Generation Expert", 
    bio: "Passionate about connecting businesses with quality leads",
    avatar: user?.user_metadata?.avatar_url || ""
  });

  const [editData, setEditData] = useState(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditData({...editData, avatar: imageUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const userInitials = profileData.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm neu-card relative overflow-hidden shadow-none border-0">
        <CardContent className="p-0">
          {/* Header with controls */}
          <div className="relative p-6 pb-4">
            <Button
              variant="ghost" 
              size="sm"
              className="absolute top-4 left-4 neu-button-small rounded-full p-2"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm" 
              className="absolute top-4 right-4 neu-button-small rounded-full p-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Profile Image Section */}
          <div className="flex justify-center px-6">
            <div className="neu-element rounded-full p-2 relative">
              <div className="neu-inset rounded-full p-1">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={isEditing ? editData.avatar : profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-2xl font-semibold neu-flat">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 neu-button-small rounded-full p-2"
                  onClick={triggerImageUpload}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 space-y-4">
            {!isEditing ? (
              <>
                <div className="text-center space-y-3 py-4">
                  <h2 className="text-xl font-semibold">{profileData.name}</h2>
                  <p className="text-muted-foreground font-medium">{profileData.title}</p>
                  <p className="text-sm text-muted-foreground px-4 leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="neu-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="neu-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="neu-input resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button onClick={handleSave} className="neu-button flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="neu-button-outline flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}