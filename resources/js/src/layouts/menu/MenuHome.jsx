import { Box } from "@mantine/core";
import { IconHomeMove } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const MenuHome = ({ classes, theme, toggleDrawer }) => {
    return (
        <Link
            className={classes.link}
            to=""
            onClick={() => toggleDrawer(false)}
        >
            <Box component="span" mr={5}>
                Inicio
            </Box>
            <IconHomeMove size={18} color={theme.colors.dark[8]} />
        </Link>
    );
};
