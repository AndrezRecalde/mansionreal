import { Button, Menu } from "@mantine/core";
import { IconChevronsRight } from "@tabler/icons-react";
import { accionesDepartamento } from "../../../components";
import Swal from "sweetalert2";

export const DepartamentoMenu = ({
    departamento,
    theme,
    onReservar,
    onEstado,
    disabled,
}) => {
    const estadoNombre = departamento.estado.nombre;

    return (
        <>
            <Menu.Dropdown>
                {["LIMPIEZA", "MANTENIMIENTO"].map((key) => {
                    const {
                        label,
                        icon: Icon,
                        color,
                        swal,
                    } = accionesDepartamento[key];
                    const { estado, getHtml, ...swalConfig } = swal;
                    return (
                        <Menu.Item
                            key={key}
                            leftSection={
                                <Icon
                                    size={18}
                                    color={theme.colors[color][7]}
                                />
                            }
                            color={color}
                            disabled={disabled}
                            onClick={() => {
                                if (disabled) return;
                                Swal.fire({
                                    ...swalConfig,
                                    html: getHtml(departamento),
                                    showCancelButton: true,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        onEstado({
                                            id: departamento.id,
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
                {estadoNombre !== "DISPONIBLE"
                    ? (() => {
                          const {
                              label,
                              icon: Icon,
                              color,
                              swal,
                          } = accionesDepartamento.DISPONIBLE;
                          const { estado, getHtml, ...swalConfig } = swal;
                          return (
                              <Menu.Item
                                  key="DISPONIBLE"
                                  leftSection={
                                      <Icon
                                          size={18}
                                          color={theme.colors[color][7]}
                                      />
                                  }
                                  color={color}
                                  disabled={disabled}
                                  onClick={() => {
                                      if (disabled) return;
                                      Swal.fire({
                                          ...swalConfig,
                                          html: getHtml(departamento),
                                          showCancelButton: true,
                                      }).then((result) => {
                                          if (result.isConfirmed) {
                                              onEstado({
                                                  id: departamento.id,
                                                  nombre_estado: estado,
                                              });
                                          }
                                      });
                                  }}
                              >
                                  {label}
                              </Menu.Item>
                          );
                      })()
                    : null}
            </Menu.Dropdown>
        </>
    );
};
