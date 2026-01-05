import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { CustomerService } from '../service/CustomerService.js';

/**
 * DescriptionEditor Component
 * Edit and save descriptions for routes and locations
 */
export function DescriptionEditor({ 
  itemId, 
  itemType = 'location', // 'route' or 'location'
  currentDescription = '',
  itemName = '',
  onSave = () => {},
  onError = () => {}
}) {
  const [description, setDescription] = useState(currentDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = { description };
      
      let result;
      if (itemType === 'route') {
        result = await CustomerService.updateRoute(itemId, updateData);
      } else {
        result = await CustomerService.updateLocation(itemId, updateData);
      }
      
      setIsEditing(false);
      onSave(result);
    } catch (error) {
      console.error('Error saving description:', error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDescription(currentDescription);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div style={{ padding: '12px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Description</h4>
          <Button 
            icon="pi pi-pencil" 
            label="Edit"
            text
            size="small"
            onClick={() => setIsEditing(true)}
            className="p-button-sm"
          />
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: description ? '#374151' : '#9ca3af' }}>
          {description || 'No description'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', borderRadius: '4px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Edit Description</h4>
      <InputTextarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description..."
        rows={4}
        style={{ width: '100%', marginBottom: '8px' }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
          label="Save"
          icon="pi pi-check"
          onClick={handleSave}
          loading={loading}
          disabled={loading}
          severity="success"
          size="small"
        />
        <Button 
          label="Cancel"
          icon="pi pi-times"
          onClick={handleCancel}
          disabled={loading}
          severity="secondary"
          text
          size="small"
        />
      </div>
    </div>
  );
}
