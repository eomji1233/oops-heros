import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** sheet: 아래에서 올라오는 시트 / dialog: 가운데 팝업 */
  variant?: "sheet" | "dialog";
  closeLabel?: string;
};

/** 세로 모바일 화면에 맞춘 모달. 배경이나 Esc 로 닫을 수 있다. */
export function Modal({ title, onClose, children, variant = "dialog", closeLabel = "닫기" }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 화면별 컨테이너가 아니라 게임 전체(.game) 위에 띄워 하단 메뉴까지 덮는다.
  const root = document.querySelector<HTMLElement>(".game") ?? document.body;

  return createPortal(
    <div className={`modal modal--${variant}`} role="presentation">
      <button type="button" className="modal__backdrop" aria-label={closeLabel} onClick={onClose} />
      <section className="modal__panel" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" aria-label={closeLabel} onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </section>
    </div>,
    root,
  );
}
