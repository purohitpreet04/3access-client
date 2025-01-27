import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from 'Constance';

const Document = () => {
    const [searchParams] = useSearchParams();
    const [htmlContent, setHtmlContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                const type = searchParams.get('type');
                const id = searchParams.get('t');
                const assessment_id = searchParams.get('assessment');

                if (!type || !id) {
                    throw new Error('Missing required parameters');
                }

                const response = await API.get('/api/tenents/getdocument', {
                    params: { type, id, assessment_id }
                });

                // Check if response.data is a function
                const content = typeof response.data === 'function'
                    ? response.data()
                    : response.data;

                setHtmlContent(content);
                setError(null);
            } catch (err) {
                console.error('Error fetching document:', err);
                setError(err.message || 'Failed to load document');
                setHtmlContent('');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [searchParams]);

    // Render loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render empty state
    if (!htmlContent) {
        return <div>No content available</div>;
    }

    // Render content
    return (
        <div className="document-wrapper" style={{ padding: '20px' }}>
            {typeof htmlContent === 'string' ? (
                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className="document-container"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        padding: '20px',
                        // boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    }}
                />
            ) : (
                <div>Invalid content format</div>
            )}
        </div>
    );
};

export default Document;
