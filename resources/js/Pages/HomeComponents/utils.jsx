import React from 'react';

export const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;

export const navigate = (url) => window.location.assign(url);

export const postHomeAction = async (url, data = {}) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify(data),
    });

    if (response.redirected) {
        navigate(response.url);
        return;
    }

    if (response.ok) {
        window.location.reload();
    }
};

export const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, className, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} className={className} {...props} />;
};
