import { AppBar, Box, DialogContent, ListItemButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Chrome拡張のコンテンツスクリプトに接続
let contentPort:chrome.runtime.Port;
let query = { active:true, currentWindow:true };
chrome.tabs.query(query, tabs => {
  if(tabs[0].id) {
    contentPort = chrome.tabs.connect(tabs[0].id);
  }
});

// ポップアップの定義
function Popup() {

  // ウィンドウの開閉
  const openWindow = () => { contentPort.postMessage('open'); };
  const closeWindow = () => { contentPort.postMessage('close'); };

  // ボタンに対して共通して定義するスタイル
  const buttonStyle = {
      color: 'white',
      transition: 'background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms',
      ':hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
  }

  // 描画処理
  return (
    <Box sx={{width:240,borderRadius:0,backgroundColor:'rgba(44,44,44,0.87)'}}>
      <AppBar elevation={0} color="transparent" position="static">
          <Toolbar variant="dense">
              <Typography variant="subtitle2" sx={{color:'white',fontWeight:'bold',flexGrow:1}}>
                  ダイスカルテ
              </Typography>
          </Toolbar>
      </AppBar>
      <DialogContent sx={{padding:'0px 0px 8px'}}>
          <ListItemButton sx={buttonStyle} onClick={openWindow}>ウィンドウを開く</ListItemButton>
          <ListItemButton sx={buttonStyle} onClick={closeWindow}>ウィンドウを閉じる</ListItemButton>
      </DialogContent>
    </Box>
  );
}

// ポップアップを描画
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup/>
  </React.StrictMode>,
);