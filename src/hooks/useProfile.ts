import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    title: 'Lead Generation Expert',
    bio: 'Passionate about connecting businesses with quality leads',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data from user metadata when user changes
  useEffect(() => {
    if (user) {
      const userProfile = {
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              "User",
        title: user.user_metadata?.title || 'Lead Generation Expert',
        bio: user.user_metadata?.bio || 'Passionate about connecting businesses with quality leads',
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.avatar || ''
      };
      setProfile(userProfile);
    }
  }, [user]);

  const updateProfile = async (newProfile: UserProfile): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // Update user metadata in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: newProfile.name,
          name: newProfile.name,
          title: newProfile.title,
          bio: newProfile.bio,
          avatar_url: newProfile.avatar,
          avatar: newProfile.avatar
        }
      });

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setProfile(newProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully!",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      toast({
        title: "Profile Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    updateProfile,
    isLoading,
    userId: user?.id
  };
}