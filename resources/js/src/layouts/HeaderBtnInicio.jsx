import { Box } from "@mantine/core";
import { IconChartAreaLineFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const HeaderBtnInicio = ({ classes, theme }) => {
    return (
        <Link
            className={classes.link}
            to="/dashboard"
        >
            <Box component="span" mr={5}>
                Panel
            </Box>
            <IconChartAreaLineFilled size={18} color={theme.colors.teal[6]} />
        </Link>
    );
};
