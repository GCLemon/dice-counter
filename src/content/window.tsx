import { AppBar, Box, CircularProgress, DialogContent, Grid, IconButton, ListItemButton, ListItemText, Modal, Paper, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/close';
import React, { useState } from 'react';
import Draggable from 'react-draggable';

import scrape from './scrape';
import cthulhu from './cthulhu';
import emoklore from './emoklore';

// ダイスカウンターのウィンドウ
export default function Window() {

    // 現在集計中か？
    const [isOpening, setIsOpening] = useState(false);
    const [isCounting, setIsCounting] = useState(false);

    // ポップアップからのメッセージを管理
    chrome.runtime.onConnect.addListener(port => {
        port.onMessage.addListener(message => {
            if(message === 'open') { setIsOpening(true); }
            if(message === 'close') { setIsOpening(false); }
        });
    });

    // クトゥルフ神話TRPGのダイス目を計算する
    const cthulhuCount = async () => {
        setIsCounting(true);
        const chats = await scrape();
        cthulhu(chats);
        setIsCounting(false);
    };

    // エモクロアTRPGのダイス目を計算する
    const emokloreCount = async () => {
        setIsCounting(true);
        const chats = await scrape();
        emoklore(chats);
        setIsCounting(false);
    };

    // ボタンに対して共通して定義するスタイル
    const buttonStyle = {
        color: 'white',
        transition: 'background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms',
        ':hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
    }

    // CCFOLIA上にウィンドウを描画
    if(isOpening) {
        return (
            <React.Fragment>
                <Draggable handle=".MuiAppBar-root">
                    <Paper elevation={6} sx={{borderRadius:0,backgroundColor:'rgba(44,44,44,0.87)',width:320}}>
                        <AppBar elevation={0} color="transparent" position="static" sx={{cursor:'move'}}>
                            <Toolbar variant="dense">
                                <Typography variant="subtitle2" sx={{color:'white',fontWeight:'bold',flexGrow:1}}>
                                    ダイスカウンター
                                </Typography>
                                <IconButton sx={{marginRight:'-3px',marginLeft:'4px',padding:'5px',...buttonStyle}} onClick={() => setIsOpening(false)}>
                                    <CloseIcon sx={{color:'white'}}/>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <DialogContent sx={{padding:'0px 0px 8px'}}>
                            <ListItemText>
                                <Typography variant="body2" sx={{padding:'8px 24px',color:'rgba(255,255,255,0.7)',fontSize:'10.5pt'}}>
                                    以下をクリックすると、ダイスロールの集計結果がJSONで出力されます。
                                </Typography>
                            </ListItemText>
                            <ListItemButton sx={buttonStyle} onClick={cthulhuCount}>For クトゥルフ神話TRPG (6版/7版)</ListItemButton>
                            <ListItemButton sx={buttonStyle} onClick={emokloreCount}>For エモクロアTRPG</ListItemButton>
                        </DialogContent>
                    </Paper>
                </Draggable>
                <Modal open={isCounting}>
                    <Box sx={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CircularProgress size={120} sx={{color:'white'}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4" sx={{color:'white'}}>集計中...</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }
    else {
        return (<></>);
    }
}