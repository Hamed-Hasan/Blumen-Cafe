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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit,
  CheckCircle,
  X,
  Clock,
  ChefHat,
  Calendar,
  Users,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

export function ProductionList() {
  const { user } = useAuth();
  const { productionPlans, recipes, products, addProductionPlan, updateProductionPlan } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    recipeId: '',
    quantity: 1,
    scheduledDate: '',
    notes: ''
  });

  const filteredPlans = productionPlans.filter(plan => {
    const recipe = recipes.find(r => r.id === plan.recipeId);
    const matchesSearch = recipe?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = plan.scheduledDate.toDateString() === new Date().toDateString();
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = plan.scheduledDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'this_week') {
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      matchesDate = plan.scheduledDate >= now && plan.scheduledDate <= weekFromNow;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'outline';
      case 'in_progress': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleStatusUpdate = (planId: string, newStatus: string) => {
    updateProductionPlan(planId, { status: newStatus as any });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipeId || !formData.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    const planData = {
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      scheduledDate: new Date(formData.scheduledDate),
      status: 'planned' as const,
      assignedBy: user?.name || '',
      notes: formData.notes
    };

    if (editingPlan) {
      updateProductionPlan(editingPlan.id, planData);
    } else {
      addProductionPlan(planData);
    }

    setShowForm(false);
    setEditingPlan(null);
    setFormData({ recipeId: '', quantity: 1, scheduledDate: '', notes: '' });
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      recipeId: plan.recipeId,
      quantity: plan.quantity,
      scheduledDate: plan.scheduledDate.toISOString().split('T')[0],
      notes: plan.notes || ''
    });
    setShowForm(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecipeName = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe?.name || 'Unknown Recipe';
  };

  const getRecipeDetails = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe;
  };

  const getTotalTime = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    return recipe.preparationTime + recipe.cookingTime;
  };

  const getRequiredIngredients = (plan: any) => {
    const recipe = recipes.find(r => r.id === plan.recipeId);
    if (!recipe) return [];
    
    return recipe.ingredients.map(ing => {
      const product = products.find(p => p.id === ing.productId);
      return {
        name: product?.name || 'Unknown',
        totalRequired: (ing.quantity * plan.quantity).toFixed(2),
        unit: ing.unit
      };
    });
  };

  const todaysPlans = productionPlans.filter(plan => 
    plan.scheduledDate.toDateString() === new Date().toDateString()
  );

  const completedToday = todaysPlans.filter(plan => plan.status === 'completed').length;
  const inProgressToday = todaysPlans.filter(plan => plan.status === 'in_progress').length;
  const plannedToday = todaysPlans.filter(plan => plan.status === 'planned').length;

  return (
    <div className="space-y-6">
      {/* Production Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Plans</p>
                <p className="text-2xl font-bold">{todaysPlans.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{inProgressToday}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planned</p>
                <p className="text-2xl font-bold text-blue-600">{plannedToday}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Plans Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ChefHat className="w-5 h-5 mr-2" />
              Production Planning
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Production Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search production plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Total Time</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => {
                  const recipe = getRecipeDetails(plan.recipeId);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{getRecipeName(plan.recipeId)}</p>
                          <p className="text-sm text-muted-foreground">
                            {recipe ? `${recipe.servings} servings per batch` : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          {plan.quantity} batches
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatDate(plan.scheduledDate)}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(plan.scheduledDate)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTotalTime(plan.recipeId)} min
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.assignedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(plan.status)}
                          <Badge variant={getStatusColor(plan.status)} className="ml-2">
                            {plan.status.replace('_', ' ')}
                          </Badge>
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
                            <DropdownMenuItem onClick={() => setSelectedPlan(plan)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(plan)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Plan
                            </DropdownMenuItem>
                            {plan.status === 'planned' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(plan.id, 'in_progress')}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Start Production
                              </DropdownMenuItem>
                            )}
                            {plan.status === 'in_progress' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusUpdate(plan.id, 'completed')}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusUpdate(plan.id, 'planned')}
                                >
                                  <PauseCircle className="mr-2 h-4 w-4" />
                                  Pause
                                </DropdownMenuItem>
                              </>
                            )}
                            {(plan.status === 'planned' || plan.status === 'in_progress') && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(plan.id, 'cancelled')}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                            {plan.status === 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(plan.id, 'planned')}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restart
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Production Plan Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Production Plan' : 'Add Production Plan'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe">Recipe</Label>
                <Select 
                  value={formData.recipeId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, recipeId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map(recipe => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name} ({recipe.servings} servings)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Batches)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Production notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Production Plan Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Plan Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recipe</Label>
                  <p className="font-medium">{getRecipeName(selectedPlan.recipeId)}</p>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <p className="font-medium">{selectedPlan.quantity} batches</p>
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <p className="font-medium">{formatDate(selectedPlan.scheduledDate)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center">
                    {getStatusIcon(selectedPlan.status)}
                    <Badge variant={getStatusColor(selectedPlan.status)} className="ml-2">
                      {selectedPlan.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Required Ingredients */}
              <div>
                <Label className="text-lg">Required Ingredients</Label>
                <div className="mt-2 space-y-2">
                  {getRequiredIngredients(selectedPlan).map((ing, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{ing.name}</span>
                      <span className="font-medium">{ing.totalRequired} {ing.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlan.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded">{selectedPlan.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}