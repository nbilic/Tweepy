import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "black",
  },

  input: {
    color: "white",
  },
  multilineColor: {
    color: "red",
    backgroundColor: "red",
  },
  menuItemText: {
    width: "200px",
    overflow: "hidden",
  },
  channelMenu: {
    height: "100vh",
    position: "fixed",
    backgroundColor: "rgb(33, 33, 33);",
  },
  navbar: {
    minWidth: "280px",
    position: "fixed",
    padding: 0,
  },
}));

export default useStyles;
