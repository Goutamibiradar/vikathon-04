'use client';

import React, { useState, useEffect } from 'react';
import { Store, Edit2, Trash2, Plus, X, Search, FileText } from 'lucide-react';
// removed mock data imports
import { Restaurant, RestaurantStatus, HygieneGrade } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select, Label } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export default function ManageRestaurants() {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // Form Fields state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [status, setStatus] = useState<RestaurantStatus>('Pending Inspection');

  const loadRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      const data = await res.json();
      if (Array.isArray(data)) setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const openAddModal = () => {
    setEditingRestaurant(null);
    setName('');
    setAddress('');
    setCuisine('');
    setOwnerName('');
    setOwnerEmail('');
    setStatus('Pending Inspection');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Restaurant) => {
    setEditingRestaurant(r);
    setName(r.name);
    setAddress(r.address);
    setCuisine(r.cuisine);
    setOwnerName(r.ownerName);
    setOwnerEmail(r.ownerEmail);
    setStatus(r.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !cuisine || !ownerName || !ownerEmail) {
      toast('Please fill out all required fields.', 'error');
      return;
    }

    const payload = {
      name,
      address,
      cuisine,
      ownerName,
      ownerEmail,
      status,
    };

    try {
      if (editingRestaurant) {
        // Edit
        const res = await fetch(`/api/restaurants/${editingRestaurant.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update');
        toast('Restaurant profile updated successfully.', 'success');
      } else {
        // Add
        const res = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add');
        toast('New restaurant registered in database.', 'success');
      }
      setIsModalOpen(false);
      loadRestaurants();
    } catch (err) {
      console.error(err);
      toast('An error occurred while saving the restaurant.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this restaurant from the health registry?')) {
      try {
        const res = await fetch(`/api/restaurants/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete');
        toast('Restaurant record removed.', 'success');
        loadRestaurants();
      } catch (err) {
        console.error(err);
        toast('Failed to delete restaurant.', 'error');
      }
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: RestaurantStatus) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Pending Inspection': return <Badge variant="warning">Pending</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Registered Establishments</h1>
          <p className="text-sm text-slate-500 mt-1">Add, update, or remove restaurants from the health inspection index.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="h-4.5 w-4.5" />
          Add Restaurant
        </Button>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <CardHeader className="p-6 pb-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Establishment</th>
                  <th className="py-3 px-4">Cuisine</th>
                  <th className="py-3 px-4">Score / Grade</th>
                  <th className="py-3 px-4">Last Inspected</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/60">
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{r.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{r.address}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-500 dark:text-slate-400">{r.cuisine}</td>
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{r.hygieneScore}%</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Grade {r.grade}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium">{r.lastInspectionDate}</td>
                      <td className="py-4 px-4">{getStatusBadge(r.status)}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(r)} className="px-2 py-2">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)} className="px-2 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-100 dark:border-rose-950">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                      No matching restaurants found in data registry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CRUD Form Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-lg">
                  {editingRestaurant ? 'Edit Restaurant Profile' : 'Register New Restaurant'}
                </CardTitle>
                <CardDescription>
                  Enter official coordinates for registry search matches.
                </CardDescription>
              </div>
              <Button variant="ghost" className="px-2 py-2" onClick={() => setIsModalOpen(false)}>
                <X className="h-4.5 w-4.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="modalName">Restaurant Name</Label>
                  <Input
                    id="modalName"
                    type="text"
                    placeholder="Grand Palace Diner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Cuisine */}
                <div className="space-y-1">
                  <Label htmlFor="modalCuisine">Cuisine Category</Label>
                  <Input
                    id="modalCuisine"
                    type="text"
                    placeholder="Mexican Street Food"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <Label htmlFor="modalAddress">Physical Address</Label>
                  <Input
                    id="modalAddress"
                    type="text"
                    placeholder="99 Broadway St, Suite A"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Owner Name */}
                  <div className="space-y-1">
                    <Label htmlFor="modalOwner">Owner Name</Label>
                    <Input
                      id="modalOwner"
                      type="text"
                      placeholder="Jane Doe"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>

                  {/* Owner Email */}
                  <div className="space-y-1">
                    <Label htmlFor="modalEmail">Owner Email</Label>
                    <Input
                      id="modalEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <Label htmlFor="modalStatus">Regulatory Status</Label>
                  <Select
                    id="modalStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RestaurantStatus)}
                    options={[
                      { label: 'Active (Approved)', value: 'Active' },
                      { label: 'Pending Initial Inspection', value: 'Pending Inspection' },
                      { label: 'Suspended (Sanitation Failures)', value: 'Suspended' },
                    ]}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
