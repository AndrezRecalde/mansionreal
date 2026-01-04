import { ActionIcon } from "@mantine/core";
import { IconAlertCircleFilled, IconDiscountCheckFilled } from "@tabler/icons-react";

export const BtnActivarElemento = ({ cell, handleActivar }) => {

    const handleActivate = (e) => {
        e.preventDefault();
        handleActivar(cell.row.original);
    };

    return (
        <ActionIcon
            variant="light"
            radius="xl"
            onClick={(e) => handleActivate(e)}
            color={cell.row.original.activo == 1 ? "teal.8" : "orange.5"} //Cambiar a un igual mas
        >
            {cell.row.original.activo == 1 ? (
                <IconDiscountCheckFilled />
            ) : (
                <IconAlertCircleFilled />
            )}
        </ActionIcon>
    );
};
