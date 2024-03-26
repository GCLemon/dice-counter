import { AppBar, DialogContent, Paper } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";

export default function Window() {
    return (
        <React.Fragment>
            <Draggable handle=".MuiAppBar-root">
                <Paper elevation={6} sx={{borderRadius:0}}>
                    <AppBar elevation={0} color="transparent" position="static">
                    </AppBar>
                    <DialogContent>
                    </DialogContent>
                </Paper>
            </Draggable>
        </React.Fragment>
    )
}