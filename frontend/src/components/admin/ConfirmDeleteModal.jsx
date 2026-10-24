function ConfirmDeleteModal({ onCancel, onConfirm, user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-white p-6 text-ink shadow-[0_10px_30px_rgba(31,41,55,0.2)]">
        <h2 className="text-2xl font-bold text-ink">Delete user?</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          This will permanently delete {user.name} and their related data. This
          action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
