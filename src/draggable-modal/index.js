import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './index.css';

function DraggableModal(props) {
  const { visible, closeHandler, children, title, id } = props;

  const draggableModalRef = useRef(null);
  const clickPositionX = useRef(0);
  const clickPositionY = useRef(0);

  const removeWindowEventListener = () => {
    window.removeEventListener('mousemove', onMouseMoveHandler);
    window.removeEventListener('mouseup', onMouseUpHandler);
  };

  const addWindowEventListener = () => {
    window.addEventListener('mousemove', onMouseMoveHandler);
    window.addEventListener('mouseup', onMouseUpHandler);
  };

  const onMouseUpHandler = () => {
    if (id) {
      const { left, top } = draggableModalRef.current.getBoundingClientRect();
      localStorage.setItem(`draggable-modal-${id}`, JSON.stringify([left, top]));
    }

    removeWindowEventListener();
  };

  const onMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    const { width, height } = draggableModalRef.current.getBoundingClientRect();

    let currentPositionX = clientX - clickPositionX.current;
    let currentPositionY = clientY - clickPositionY.current;
    const boundaryRight = window.innerWidth - width;
    const boundaryBottom = window.innerHeight - height;
    currentPositionX = Math.max(currentPositionX, 0);
    currentPositionX = Math.min(currentPositionX, boundaryRight);
    currentPositionY = Math.max(currentPositionY, 0);
    currentPositionY = Math.min(currentPositionY, boundaryBottom);

    draggableModalRef.current.style.left = `${currentPositionX}px`;
    draggableModalRef.current.style.top = `${currentPositionY}px`;
  };

  const onMouseDownHandler = (event) => {
    const { clientX, clientY } = event;
    const { left, top } = draggableModalRef.current.getBoundingClientRect();
    clickPositionX.current = clientX - left;
    clickPositionY.current = clientY - top;

    addWindowEventListener();
  };

  const layerUp = () => {
    try {
      document.querySelectorAll('.draggable-modal').forEach(draggableModalDom => draggableModalDom.style.zIndex = 'auto');
      draggableModalRef.current.style.zIndex = '10';
    } catch (error) {

    }
  };

  const initPosition = () => {
    if (!id) return;
    const initialPositionStringify = localStorage.getItem(`draggable-modal-${id}`);
    const initialPosition = initialPositionStringify ? JSON.parse(initialPositionStringify) : null;
    if (initialPosition) {
      const [initialPositionX, initialPositionY] = initialPosition;
      draggableModalRef.current.style.left = `${initialPositionX}px`;
      draggableModalRef.current.style.top = `${initialPositionY}px`;
    }
  };

  useEffect(() => {
    if (visible) {
      initPosition();
      layerUp();
    } else {

    }
  }, [visible]);

  if (!visible) return null;

  return createPortal((
    <div className="draggable-modal window active" ref={draggableModalRef} onMouseDown={layerUp}>
      <div className="title-bar">
        <div className="title-bar-text" onMouseDown={onMouseDownHandler}>{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={closeHandler}></button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  ), document.body);
}

export default DraggableModal;
