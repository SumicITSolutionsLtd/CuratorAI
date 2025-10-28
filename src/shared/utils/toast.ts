import toast from 'react-hot-toast'
import { Heart, Check, AlertCircle, Info, Sparkles, ShoppingBag, X } from 'lucide-react'
import { createElement } from 'react'

// Custom toast configurations with beautiful icons and animations
export const showToast = {
  success: (message: string, description?: string) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`,
          },
          [
            createElement(
              'div',
              {
                key: 'icon',
                className: 'flex-shrink-0 bg-green-500 flex items-center justify-center w-16',
              },
              createElement(Check, { className: 'h-6 w-6 text-white', strokeWidth: 3 })
            ),
            createElement('div', { key: 'content', className: 'flex-1 p-4' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold text-gray-900' },
                message
              ),
              description &&
                createElement(
                  'p',
                  { key: 'description', className: 'mt-1 text-sm text-gray-500' },
                  description
                ),
            ]),
            createElement(
              'div',
              { key: 'close', className: 'flex border-l border-gray-200' },
              createElement(
                'button',
                {
                  onClick: () => toast.dismiss(t.id),
                  className:
                    'w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none',
                },
                createElement(X, { className: 'h-5 w-5' })
              )
            ),
          ]
        ),
      { duration: 4000 }
    )
  },

  error: (message: string, description?: string) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`,
          },
          [
            createElement(
              'div',
              {
                key: 'icon',
                className: 'flex-shrink-0 bg-red-500 flex items-center justify-center w-16',
              },
              createElement(AlertCircle, { className: 'h-6 w-6 text-white' })
            ),
            createElement('div', { key: 'content', className: 'flex-1 p-4' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold text-gray-900' },
                message
              ),
              description &&
                createElement(
                  'p',
                  { key: 'description', className: 'mt-1 text-sm text-gray-500' },
                  description
                ),
            ]),
            createElement(
              'div',
              { key: 'close', className: 'flex border-l border-gray-200' },
              createElement(
                'button',
                {
                  onClick: () => toast.dismiss(t.id),
                  className:
                    'w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none',
                },
                createElement(X, { className: 'h-5 w-5' })
              )
            ),
          ]
        ),
      { duration: 5000 }
    )
  },

  info: (message: string, description?: string) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`,
          },
          [
            createElement(
              'div',
              {
                key: 'icon',
                className: 'flex-shrink-0 bg-blue-500 flex items-center justify-center w-16',
              },
              createElement(Info, { className: 'h-6 w-6 text-white' })
            ),
            createElement('div', { key: 'content', className: 'flex-1 p-4' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold text-gray-900' },
                message
              ),
              description &&
                createElement(
                  'p',
                  { key: 'description', className: 'mt-1 text-sm text-gray-500' },
                  description
                ),
            ]),
            createElement(
              'div',
              { key: 'close', className: 'flex border-l border-gray-200' },
              createElement(
                'button',
                {
                  onClick: () => toast.dismiss(t.id),
                  className:
                    'w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none',
                },
                createElement(X, { className: 'h-5 w-5' })
              )
            ),
          ]
        ),
      { duration: 4000 }
    )
  },

  like: (userName: string) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg rounded-xl pointer-events-auto flex items-center p-4 text-white`,
          },
          [
            createElement(
              'div',
              { key: 'icon', className: 'flex-shrink-0' },
              createElement(Heart, { className: 'h-6 w-6 fill-current' })
            ),
            createElement('div', { key: 'content', className: 'ml-3 flex-1' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold' },
                `${userName} liked your outfit!`
              ),
            ]),
            createElement(
              'button',
              {
                key: 'close',
                onClick: () => toast.dismiss(t.id),
                className: 'ml-4 inline-flex text-white hover:text-gray-100',
              },
              createElement(X, { className: 'h-5 w-5' })
            ),
          ]
        ),
      { duration: 3000 }
    )
  },

  recommendation: (count: number) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-gradient-to-r from-brand-crimson to-brand-blue shadow-lg rounded-xl pointer-events-auto flex items-center p-4 text-white`,
          },
          [
            createElement(
              'div',
              { key: 'icon', className: 'flex-shrink-0' },
              createElement(Sparkles, { className: 'h-6 w-6' })
            ),
            createElement('div', { key: 'content', className: 'ml-3 flex-1' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold' },
                'New Recommendations!'
              ),
              createElement(
                'p',
                { key: 'description', className: 'mt-0.5 text-sm opacity-90' },
                `${count} new outfits curated for you`
              ),
            ]),
            createElement(
              'button',
              {
                key: 'close',
                onClick: () => toast.dismiss(t.id),
                className: 'ml-4 inline-flex text-white hover:text-gray-100',
              },
              createElement(X, { className: 'h-5 w-5' })
            ),
          ]
        ),
      { duration: 4000 }
    )
  },

  addedToCart: (itemName: string) => {
    toast.custom(
      (t) =>
        createElement(
          'div',
          {
            className: `${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`,
          },
          [
            createElement(
              'div',
              {
                key: 'icon',
                className: 'flex-shrink-0 bg-brand-crimson flex items-center justify-center w-16',
              },
              createElement(ShoppingBag, { className: 'h-6 w-6 text-white' })
            ),
            createElement('div', { key: 'content', className: 'flex-1 p-4' }, [
              createElement(
                'p',
                { key: 'message', className: 'text-sm font-semibold text-gray-900' },
                'Added to Cart'
              ),
              createElement(
                'p',
                { key: 'description', className: 'mt-1 text-sm text-gray-500' },
                itemName
              ),
            ]),
            createElement(
              'div',
              { key: 'action', className: 'flex border-l border-gray-200' },
              createElement(
                'button',
                {
                  onClick: () => {
                    toast.dismiss(t.id)
                    // Navigate to cart - would need router context
                  },
                  className:
                    'w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-brand-crimson hover:text-brand-crimson/80 focus:outline-none',
                },
                'View Cart'
              )
            ),
          ]
        ),
      { duration: 3000 }
    )
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#fff',
        color: '#1C1917',
      },
    })
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    })
  },
}
