import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ICONS = {
  danger: <Trash2 size={22} />,
  warning: <AlertTriangle size={22} />,
  success: <CheckCircle size={22} />,
};

const COLORS = {
  danger: 'var(--danger)',
  warning: 'var(--warning)',
  success: 'var(--success)',
};

/**
 * ActionModal – Component tái sử dụng cho Confirm / Prompt
 *
 * Props:
 *  - isOpen (bool)
 *  - title (string)
 *  - message (string) – Nội dung câu hỏi / mô tả
 *  - type ('danger' | 'warning' | 'success')
 *  - confirmText (string) – Text nút xác nhận (mặc định: "Xác nhận")
 *  - requireInput (bool) – Có hiện ô nhập liệu không
 *  - inputLabel (string) – Label cho ô input
 *  - inputType ('text' | 'number' | 'textarea') – Kiểu input
 *  - inputPlaceholder (string)
 *  - onConfirm(inputValue?) – Callback khi bấm Xác nhận
 *  - onCancel() – Callback khi bấm Hủy / Escape / Click overlay
 */
const ActionModal = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmText = 'Xác nhận',
  requireInput = false,
  inputLabel = '',
  inputType = 'textarea',
  inputPlaceholder = '',
  onConfirm,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Reset input khi mở modal
  useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);

  // Đóng khi bấm Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isDisabled = requireInput && !inputValue.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    onConfirm(requireInput ? inputValue.trim() : undefined);
  };

  const color = COLORS[type] || COLORS.warning;
  const icon = ICONS[type] || ICONS.warning;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: '100%', maxWidth: '420px', animation: 'slideUp 0.2s ease' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: `${color}15`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {icon}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h2>
        </div>

        {/* Message */}
        {message && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {requireInput && (
            <div className="form-group">
              {inputLabel && <label className="form-label">{inputLabel}</label>}
              {inputType === 'textarea' ? (
                <textarea
                  className="form-control"
                  rows="3"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  autoFocus
                />
              ) : (
                <input
                  type={inputType}
                  className="form-control"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  autoFocus
                />
              )}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: requireInput ? '12px' : '4px' }}>
            <button type="button" className="btn btn-outline" onClick={onCancel}>Hủy</button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isDisabled}
              style={{
                backgroundColor: color, borderColor: color,
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionModal;
