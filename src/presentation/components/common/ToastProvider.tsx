import { Toaster } from 'react-hot-toast'

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: '',
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1C1917',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
          maxWidth: '420px',
          minWidth: '300px',
        },

        // Success toast
        success: {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },

        // Error toast
        error: {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },

        // Loading toast
        loading: {
          style: {
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#fff',
          },
        },

        // Custom variant for brand colors
        custom: {
          style: {
            background: 'linear-gradient(135deg, #E63946 0%, #A4161A 100%)',
            color: '#fff',
          },
        },
      }}
    />
  )
}
