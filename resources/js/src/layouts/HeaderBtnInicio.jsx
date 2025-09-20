import { Box } from "@mantine/core";
import { IconHomeMove } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const HeaderBtnInicio = ({ classes, theme }) => {
    return (
        <Link
            className={classes.link}
            to="/dashboard"
        >
            <Box component="span" mr={5}>
                Inicio
            </Box>
            <IconHomeMove size={18} color={theme.colors.dark[6]} />
        </Link>
    );
};
