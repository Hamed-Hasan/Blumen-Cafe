'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit,
  Trash2,
  ChefHat,
  Clock,
  Users
} from 'lucide-react';

export function RecipesList() {
  const { user } = useAuth();
  const { recipes, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIngredientNames = (recipe: any) => {
    return recipe.ingredients
      .map((ing: any) => {
        const product = products.find(p => p.id === ing.productId);
        return product?.name || 'Unknown';
      })
      .slice(0, 3)
      .join(', ') + (recipe.ingredients.length > 3 ? '...' : '');
  };

  const getTotalTime = (recipe: any) => {
    return recipe.preparationTime + recipe.cookingTime;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ChefHat className="w-5 h-5 mr-2" />
              Recipe Management
            </CardTitle>
            {user?.role === 'main_manager' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Main Ingredients</TableHead>
                  <TableHead>Prep Time</TableHead>
                  <TableHead>Cook Time</TableHead>
                  <TableHead>Total Time</TableHead>
                  <TableHead>Servings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{recipe.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getIngredientNames(recipe)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        {recipe.preparationTime}m
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ChefHat className="w-4 h-4 mr-1 text-muted-foreground" />
                        {recipe.cookingTime}m
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getTotalTime(recipe)}m
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                        {recipe.servings}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {user?.role === 'main_manager' && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Recipe
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}