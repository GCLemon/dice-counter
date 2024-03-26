import { AppBar, DialogContent, IconButton, ListItemButton, ListItemText, Paper, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/close";
import React from "react";
import Draggable from "react-draggable";

import scrape from "./scrape";

// ダイスカウンターのウィンドウ
export default function Window() {

    // ボタンに対して共通して定義するスタイル
    const buttonStyle = {
        color: 'white',
        transition: 'background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms',
        ':hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
    }

    // CCFOLIA上にウィンドウを描画
    return (
        <React.Fragment>
            <Draggable handle=".MuiAppBar-root">
                <Paper elevation={6} sx={{borderRadius:0,backgroundColor:'rgba(44,44,44,0.87)',width:320}}>
                    <AppBar elevation={0} color="transparent" position="static" sx={{cursor:'move'}}>
                        <Toolbar variant="dense">
                            <Typography variant="subtitle2" sx={{color:'white',fontWeight:'bold',flexGrow:1}}>
                                ダイスカウンター
                            </Typography>
                            <IconButton sx={{marginRight:'-3px',marginLeft:'4px',padding:'5px',...buttonStyle}}>
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
                        <ListItemButton sx={buttonStyle} onClick={scrape}>For クトゥルフ神話TRPG (6版/7版)</ListItemButton>
                        <ListItemButton sx={buttonStyle}>For エモクロアTRPG</ListItemButton>
                    </DialogContent>
                </Paper>
            </Draggable>
        </React.Fragment>
    )
}