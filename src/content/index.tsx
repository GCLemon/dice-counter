import ReactDOM from "react-dom/client";
import Window from "./window";

// ウィンドウを作る
const createWindow = () => {

    // 描画先がなければ時間をおいて再実行
    const root = document.getElementById('root');
    if(!root) {
        setTimeout(createWindow, 500);
        return;
    }

    // ロードが終わっていたら要素を追加
    const dist = document.createElement('div');
    dist.style.position = 'fixed';
    dist.style.left = '0px';
    dist.style.top = '0px';
    dist.style.zIndex = '1201';
    document.body.appendChild(dist);
    ReactDOM.createRoot(dist as HTMLElement).render(<Window/>);
};

// ロード時のイベントリスナーを追加
window.onload = createWindow;