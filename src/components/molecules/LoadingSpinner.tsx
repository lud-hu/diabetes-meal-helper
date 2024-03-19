function LoadingSpinner() {
  return (
    <>
      <style>{`
            .loader--wrapper {
                height: 100vh;
                width: 100vw;
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .loader--spinner {
                border: 10px solid #f3f3f3;
                border-top: 10px solid #3498db;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% {
                transform: rotate(0deg);
                }
                100% {
                transform: rotate(360deg);
                }
            }
          `}</style>
      <div className="loader--wrapper bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
        <div className="loader--spinner"></div>
      </div>
    </>
  );
}

export default LoadingSpinner;
