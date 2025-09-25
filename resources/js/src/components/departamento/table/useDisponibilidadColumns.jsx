import { useMemo } from "react";
import { Badge, Image, Text } from "@mantine/core";
import { IconBookmarksFilled, IconCheckbox } from "@tabler/icons-react";
import { BtnSection, ReservaMenu } from "../../../components";

export function useDisponibilidadColumns({
    theme,
    setOpened,
    fnAsignarDepartamento,
    handleReservarClick,
    handleEstadoClick,
    handleFinalizarReservaClick,
}) {
    return useMemo(
        () => [
            {
                accessorKey: "imagenes",
                header: "Imagen",
                size: 80,
                Cell: ({ row }) => {
                    const imagenSrc =
                        row.original.imagenes.length > 0
                            ? `/storage/${row.original.imagenes[0]}`
                            : "https://via.placeholder.com/120x80?text=No+Image";
                    return (
                        <Image
                            fit="cover"
                            src={imagenSrc}
                            width={60}
                            height={60}
                            radius="sm"
                            style={{ cursor: "pointer" }}
                            onDoubleClick={() => {
                                const departamento = row.original;
                                if (
                                    [
                                        "DISPONIBLE",
                                        "LIMPIEZA",
                                        "MANTENIMIENTO",
                                    ].includes(departamento.estado.nombre)
                                ) {
                                    // ...Swal logic...
                                    return;
                                } else {
                                    fnAsignarDepartamento(departamento);
                                    setOpened(true);
                                }
                            }}
                        />
                    );
                },
                enableColumnActions: false,
                enableResizing: false,
            },
            {
                id: "estado.nombre",
                accessorKey: "estado.nombre",
                header: "Estado",
                size: 80,
                Cell: ({ row }) => {
                    const estado = row.original.estado;
                    return (
                        <Badge variant="dot" radius="md" color={estado.color}>
                            {estado.nombre}
                        </Badge>
                    );
                },
                enableColumnActions: false,
                enableResizing: false,
            },
            {
                accessorKey: "numero_departamento",
                header: "Departamento",
                size: 80,
            },
            {
                accessorKey: "tipo_departamento",
                header: "Tipo Departamento",
                size: 80,
                wrap: true,
            },
            {
                accessorKey: "precio_noche",
                header: "Precio/Noche",
                size: 80,
                Cell: ({ row }) => (
                    <div>
                        <Text fz="md" fw={700} style={{ lineHeight: 1 }}>
                            ${row.original.precio_noche.toFixed(2)}
                        </Text>
                        <Text fz="xs" fw={500} style={{ lineHeight: 1 }}>
                            por noche
                        </Text>
                    </div>
                ),
            },
            {
                accessorKey: "acciones",
                header: "Reservar / Acciones",
                size: 180,
                Cell: ({ row }) => {
                    const departamento = row.original;
                    if (
                        departamento.estado.nombre === "OCUPADO" ||
                        departamento.estado.nombre === "RESERVADO"
                    ) {
                        return (
                            <BtnSection
                                fullWidth
                                heigh={30}
                                fontSize={12}
                                IconSection={IconCheckbox}
                                disabled={
                                    departamento.estado.nombre === "OCUPADO" ||
                                    departamento.estado.nombre === "RESERVADO" ? false : true
                                }
                                handleAction={() => handleFinalizarReservaClick(departamento)}
                            >
                                Finalizar Reserva
                            </BtnSection>
                        );
                    }
                    return (
                        <BtnSection
                            fullWidth
                            heigh={30}
                            fontSize={12}
                            IconSection={IconBookmarksFilled}
                            disabled={
                                departamento.estado.nombre !== "DISPONIBLE"
                            }
                            handleAction={() => handleReservarClick(departamento)}
                        >
                            Reservar
                        </BtnSection>
                    );
                },
                enableColumnActions: false,
                enableResizing: false,
            },
        ],
        [
            theme,
            setOpened,
            fnAsignarDepartamento,
            handleReservarClick,
            handleEstadoClick,
            handleFinalizarReservaClick,
        ]
    );
}
