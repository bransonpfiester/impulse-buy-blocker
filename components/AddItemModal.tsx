'use client';

import { useState } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; price: number; notes?: string; imageUrl?: string }) => void;
}

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) return;
    
    onAdd({
      name,
      price: parseFloat(price),
      notes: notes || undefined,
      imageUrl: imageUrl || undefined,
    });

    // Reset form
    setName('');
    setPrice('');
    setNotes('');
    setImageUrl('');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
            Add Impulse Item
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g., New headphones"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Notes <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
              placeholder="Why do you want this?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Upload Image <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {imageUrl && (
              <div className="mt-4">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
