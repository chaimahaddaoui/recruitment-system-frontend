'use client';

import toast from 'react-hot-toast';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmDialog = ({
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmColor = 'red',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
  };

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5`}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{message}</p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    toast.dismiss(t.id);
                  }}
                  className={`flex-1 ${colorClasses[confirmColor]} text-white font-bold py-2.5 px-4 rounded-xl transition-all hover:scale-105 shadow-lg`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={() => {
                    onCancel?.();
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition-all hover:scale-105"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: Infinity, // Ne disparaît pas automatiquement
      position: 'top-center',
    }
  );
};