import { Button, Menu } from "@mantine/core";
import { IconChevronsRight } from "@tabler/icons-react";
import { accionesDepartamento } from "../../../components";
import Swal from "sweetalert2";

export const ReservaMenu = ({ departamento, theme, onFinalizarReserva }) => {
    return (
        <Menu withArrow withinPortal width={200}>
            <Menu.Target>
                <Button
                    variant="default"
                    radius="sm"
                    size="xs"
                    leftSection={<IconChevronsRight size={18} />}
                >
                    Acción Reserva
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {["PAGADO", "CANCELADO"].map((key) => {
                    const { label, icon: Icon, color, swal } = accionesDepartamento[key];
                    const { estado, getHtml, ...swalConfig } = swal;
                    return (
                        <Menu.Item
                            key={key}
                            leftSection={<Icon size={18} color={theme.colors[color][7]} />}
                            color={color}
                            onClick={() => {
                                Swal.fire({
                                    ...swalConfig,
                                    html: getHtml(departamento),
                                    showCancelButton: true,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        onFinalizarReserva({
                                            id: departamento.reserva.id,
                                            nombre_estado: estado,
                                        });
                                    }
                                });
                            }}
                        >
                            {label}
                        </Menu.Item>
                    );
                })}
            </Menu.Dropdown>
        </Menu>
    );
};
