import React from "react";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button"

const theme = createMuiTheme({
    palette: {
      primary: { main: '#1FD662' },
    },
  });

const useStyles = makeStyles(theme => ({
    paper: {
      position: "absolute",
      maxWidth: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius:"3%"
    }
}));

const AuthModal = ({
    open,
    handleClose,
    authFunction
}) => {
    const classes = useStyles();

    return (
        <div>
            <Modal
            open={open}
            onClose={handleClose}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
            }}
            >
                <div className={classes.paper} align="center">
                    <h2>Click the button below to link your Spotify account</h2>
                    <div align="center">
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" color="primary" onClick={()=>authFunction()}> 
                                Link Spotify
                            </Button>
                        </ThemeProvider>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AuthModal;