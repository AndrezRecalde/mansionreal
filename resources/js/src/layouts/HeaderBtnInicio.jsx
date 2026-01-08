import { Box } from "@mantine/core";
import { IconChartAreaLineFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const HeaderBtnInicio = ({ classes, theme }) => {
    return (
        <Link
            className={classes.link}
            to="/gerencia/dashboard"
        >
            <Box component="span" mr={5}>
                Panel
            </Box>
            <IconChartAreaLineFilled size={18} />
        </Link>
    );
};
