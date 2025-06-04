import React, { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      {loading ? (
        <>
          <h2 style={{ marginBottom: '20px' }}>HashLoader</h2>
          <HashLoader color="#624bff" size={70} />
        </>
      ) : (
        <h2>Content Loaded 🎉</h2>
      )}
    </div>
  );
};

export default Loader;
