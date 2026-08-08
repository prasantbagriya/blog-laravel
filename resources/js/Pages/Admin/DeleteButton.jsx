import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DeleteButton({ id, type, endpoint, onSuccess, label = 'Delete' }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const apiEndpoint = endpoint || `/api/admin/${type}s`;
            const res = await fetch(`${apiEndpoint}?id=${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    window.location.reload();
                }
            } else {
                alert('Failed to delete item.');
                setIsDeleting(false);
            }
        } catch (err) {
            alert('Connection error');
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={onDelete}
            disabled={isDeleting}
            aria-label={isDeleting ? `Deleting...` : `Delete ${type}`}
            style={{ 
                color: '#ef4444', 
                background: 'none', 
                border: 'none', 
                padding: '0.5rem 0', 
                cursor: 'pointer', 
                fontSize: '13px', 
                fontWeight: 600,
                opacity: isDeleting ? 0.5 : 1,
                minWidth: '60px',
                textAlign: 'left',
                whiteSpace: 'nowrap'
            }}
        >
            {isDeleting ? 'Deleting...' : label}
        </button>
    );
}
