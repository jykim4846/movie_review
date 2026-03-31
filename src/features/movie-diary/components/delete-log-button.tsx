"use client";

type DeleteLogButtonProps = {
  onDelete: () => void | Promise<void>;
};

export function DeleteLogButton({ onDelete }: DeleteLogButtonProps) {
  return (
    <button
      type="submit"
      formAction={async () => {
        const confirmed = window.confirm("이 영화 기록을 삭제하시겠습니까?");
        if (!confirmed) {
          return;
        }

        await onDelete();
      }}
      className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold text-rose-200"
    >
      삭제
    </button>
  );
}
