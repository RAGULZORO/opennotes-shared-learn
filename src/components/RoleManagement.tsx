import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserCog } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  created_at: string;
  roles: string[];
}

export default function RoleManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  const fetchUsersWithRoles = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users with roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'staff' | 'admin') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // If user already has this role, remove it
      if (user.roles.includes(newRole)) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', newRole);

        if (error) throw error;
        toast.success(`Removed ${newRole} role`);
      } else {
        // Add the new role
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: newRole }]);

        if (error) throw error;
        toast.success(`Added ${newRole} role`);
      }

      // Also update the profiles table role to match the primary role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', userId);

      if (profileError) throw profileError;

      fetchUsersWithRoles();
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Role update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No users registered</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>
      
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCog className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:justify-end">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge 
                        key={role} 
                        variant={role === 'admin' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {role}
                      </Badge>
                    ))}
                    {user.roles.length === 0 && (
                      <Badge variant="outline">No roles</Badge>
                    )}
                  </div>
                  
                  <Select
                    onValueChange={(value) => handleRoleChange(user.id, value as 'staff' | 'admin')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Manage roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">
                        {user.roles.includes('staff') ? 'Remove' : 'Add'} Staff
                      </SelectItem>
                      <SelectItem value="admin">
                        {user.roles.includes('admin') ? 'Remove' : 'Add'} Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
