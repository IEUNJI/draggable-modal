import { useState } from 'react';
import DraggableModal from './draggable-modal';
import './App.css';

function App() {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  return (
    <div className="app">
      <button onClick={() => setVisible1(true)}>打开1</button>
      <DraggableModal
        visible={visible1}
        closeHandler={() => setVisible1(false)}
        title="视频标题1"
        id="video-1"
      >
        <div className="video-content">这里是视频内容区域1</div>
      </DraggableModal>

      <button onClick={() => setVisible2(true)}>打开2</button>
      <DraggableModal
        visible={visible2}
        closeHandler={() => setVisible2(false)}
        title="视频标题2"
        id="video-2"
      >
        <div className="video-content">这里是视频内容区域2</div>
      </DraggableModal>
    </div>
  );
}

export default App;
