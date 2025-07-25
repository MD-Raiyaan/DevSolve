import React from 'react'

function ErrorMessage({message}) {
  if (!message) return null;

  return (
    <div className="w-full mb-4 text-red-600 p-0  text-sm mt-4 animate-in fade-in slide-in-from-top-1">
      {message}
    </div>
  );
}

export default ErrorMessage

